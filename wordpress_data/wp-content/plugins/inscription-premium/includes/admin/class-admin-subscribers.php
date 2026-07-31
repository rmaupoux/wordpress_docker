<?php
/**
 * Sous-menu "Abonnés" : liste (WP_List_Table), actions rapides, bulk actions,
 * fiche d'édition dédiée avec historique, export CSV.
 * Toute action d'écriture passe par cette classe : vérification de capacité
 * (manage_ip_subscriptions), nonce, et log dans wp_ip_subscription_history.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Admin_Subscribers {

	const CAPABILITY = 'manage_ip_subscriptions';

	private static $instance = null;
	private $notice = '';

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		// Priorité 10 (après IP_Admin_Settings::register_menu, priorité 5) pour
		// que la page "Réglages" reste le premier sous-menu du parent.
		add_action( 'admin_menu', array( $this, 'register_menu' ), 10 );
		add_action( 'admin_init', array( $this, 'maybe_handle_row_action' ) );
		add_action( 'admin_init', array( $this, 'maybe_handle_edit_save' ) );
		add_action( 'admin_init', array( $this, 'maybe_export_csv' ) );
	}

	public function register_menu() {
		add_submenu_page(
			'inscription-premium',
			__( 'Abonnés', 'inscription-premium' ),
			__( 'Abonnés', 'inscription-premium' ),
			self::CAPABILITY,
			'ip-subscribers',
			array( $this, 'render_page' )
		);
	}

	private function is_subscribers_screen() {
		return isset( $_GET['page'] ) && 'ip-subscribers' === $_GET['page'];
	}

	/* ---------------------------------------------------------------------
	 * Actions rapides sur une ligne (Prolonger / Suspendre / Réactiver / Annuler)
	 * ------------------------------------------------------------------ */

	public static function row_action_url( $action, $user_id ) {
		$url = add_query_arg( array(
			'page'      => 'ip-subscribers',
			'ip_action' => $action,
			'user_id'   => $user_id,
		), admin_url( 'admin.php' ) );

		return wp_nonce_url( $url, 'ip_row_action_' . $user_id );
	}

	public function maybe_handle_row_action() {
		if ( ! $this->is_subscribers_screen() || empty( $_GET['ip_action'] ) || empty( $_GET['user_id'] ) ) {
			return;
		}

		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		$user_id = (int) $_GET['user_id'];
		check_admin_referer( 'ip_row_action_' . $user_id );

		$this->apply_action( sanitize_key( wp_unslash( $_GET['ip_action'] ) ), array( $user_id ) );

		wp_safe_redirect( remove_query_arg( array( 'ip_action', 'user_id', '_wpnonce' ) ) );
		exit;
	}

	/* ---------------------------------------------------------------------
	 * Bulk actions (formulaire WP_List_Table)
	 * ------------------------------------------------------------------ */

	private function maybe_handle_bulk_action( IP_Subscribers_List_Table $table ) {
		$action = $table->current_action();

		if ( ! $action || empty( $_REQUEST['user_ids'] ) ) {
			return;
		}

		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		check_admin_referer( 'bulk-subscribers' );

		$user_ids = array_map( 'intval', (array) $_REQUEST['user_ids'] );
		$this->apply_action( $action, $user_ids );

		$this->notice = __( 'Action groupée appliquée.', 'inscription-premium' );
	}

	private function apply_action( $action, array $user_ids ) {
		$current_admin_id = get_current_user_id();

		foreach ( $user_ids as $user_id ) {
			switch ( $action ) {
				case 'extend_7':
					$this->extend_expiry( $user_id, 7, $current_admin_id );
					break;

				case 'extend_30':
					$this->extend_expiry( $user_id, 30, $current_admin_id );
					break;

				case 'suspend':
					$this->set_status( $user_id, 'suspended', $current_admin_id );
					break;

				case 'reactivate':
					$this->set_status( $user_id, 'active', $current_admin_id );
					break;

				case 'cancel':
					$this->set_status( $user_id, 'expired', $current_admin_id, 'cancelled' );
					break;

				case 'remind':
					$this->send_expiry_reminder( $user_id );
					break;
			}
		}
	}

	private function extend_expiry( $user_id, $days, $admin_id ) {
		$current_expiry = get_user_meta( $user_id, 'ip_subscription_expiry', true );
		$base            = $current_expiry && strtotime( $current_expiry ) > time() ? $current_expiry : current_time( 'Y-m-d' );
		$new_expiry      = gmdate( 'Y-m-d', strtotime( $base . " +{$days} days" ) );

		update_user_meta( $user_id, 'ip_subscription_expiry', $new_expiry );
		update_user_meta( $user_id, 'ip_subscription_status', 'active' );

		IP_Subscription_History::log( $user_id, 'extend', null, null, sprintf( 'Prolongation de %d jours (nouvelle échéance %s)', $days, $new_expiry ), $admin_id );
		do_action( 'inscription_premium_subscription_updated', $user_id );
	}

	private function set_status( $user_id, $status, $admin_id, $action_type = null ) {
		update_user_meta( $user_id, 'ip_subscription_status', $status );

		IP_Subscription_History::log( $user_id, $action_type ?: $status, null, null, sprintf( 'Statut passé à "%s"', $status ), $admin_id );
		do_action( 'inscription_premium_subscription_updated', $user_id );
	}

	private function send_expiry_reminder( $user_id ) {
		$user = get_userdata( $user_id );

		if ( ! $user ) {
			return;
		}

		$expiry = get_user_meta( $user_id, 'ip_subscription_expiry', true );

		wp_mail(
			$user->user_email,
			__( 'Votre abonnement arrive à échéance', 'inscription-premium' ),
			sprintf(
				/* translators: 1: display name, 2: expiry date */
				__( 'Bonjour %1$s,%2$sVotre abonnement expire le %3$s. Pensez à le renouveler pour continuer à publier vos annonces.', 'inscription-premium' ),
				$user->display_name,
				"\n\n",
				$expiry ?: '—'
			)
		);

		IP_Subscription_History::log( $user_id, 'reminder_sent', null, null, __( 'Email de rappel envoyé', 'inscription-premium' ), get_current_user_id() );
	}

	/* ---------------------------------------------------------------------
	 * Badge de statut (réutilisé par la list table)
	 * ------------------------------------------------------------------ */

	public static function status_badge( $status, $expiry = '' ) {
		if ( 'active' === $status && $expiry && strtotime( $expiry ) <= strtotime( '+7 days' ) && strtotime( $expiry ) >= time() ) {
			return '<span class="ip-badge ip-badge-warning">' . esc_html__( 'Expire bientôt', 'inscription-premium' ) . '</span>';
		}

		$map = array(
			'active'    => array( 'label' => __( 'Actif', 'inscription-premium' ), 'class' => 'ip-badge-success' ),
			'expired'   => array( 'label' => __( 'Expiré', 'inscription-premium' ), 'class' => 'ip-badge-neutral' ),
			'suspended' => array( 'label' => __( 'Suspendu', 'inscription-premium' ), 'class' => 'ip-badge-danger' ),
			'none'      => array( 'label' => __( 'Aucun', 'inscription-premium' ), 'class' => 'ip-badge-neutral' ),
		);

		$config = $map[ $status ] ?? $map['none'];

		return sprintf( '<span class="ip-badge %s">%s</span>', esc_attr( $config['class'] ), esc_html( $config['label'] ) );
	}

	/* ---------------------------------------------------------------------
	 * Liste
	 * ------------------------------------------------------------------ */

	public function render_page() {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] ) {
			$this->render_edit_page();

			return;
		}

		$table = new IP_Subscribers_List_Table();
		$this->maybe_handle_bulk_action( $table );
		$table->prepare_items();
		?>
		<div class="wrap ip-admin-subscribers">
			<h1><?php esc_html_e( 'Abonnés', 'inscription-premium' ); ?></h1>

			<?php if ( $this->notice ) : ?>
				<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $this->notice ); ?></p></div>
			<?php endif; ?>

			<form method="get">
				<input type="hidden" name="page" value="ip-subscribers" />
				<?php $table->search_box( __( 'Rechercher', 'inscription-premium' ), 'ip-subscriber-search' ); ?>
				<?php $table->display(); ?>
			</form>
		</div>
		<?php
	}

	/* ---------------------------------------------------------------------
	 * Fiche détail / édition
	 * ------------------------------------------------------------------ */

	public function maybe_handle_edit_save() {
		if ( ! $this->is_subscribers_screen() || empty( $_POST['ip_edit_submit'] ) ) {
			return;
		}

		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		$user_id = (int) ( $_POST['user_id'] ?? 0 );
		check_admin_referer( 'ip_edit_subscriber_' . $user_id, 'ip_edit_nonce' );

		$status  = sanitize_key( wp_unslash( $_POST['ip_status'] ?? 'none' ) );
		$expiry  = sanitize_text_field( wp_unslash( $_POST['ip_expiry'] ?? '' ) );
		$plan    = sanitize_key( wp_unslash( $_POST['ip_plan'] ?? '' ) );
		$note    = sanitize_textarea_field( wp_unslash( $_POST['ip_note'] ?? '' ) );

		update_user_meta( $user_id, 'ip_subscription_status', $status );
		update_user_meta( $user_id, 'ip_subscription_expiry', $expiry );
		update_user_meta( $user_id, 'ip_subscription_plan', $plan );

		IP_Subscription_History::log( $user_id, 'manual_edit', null, null, $note ?: __( 'Modification manuelle depuis le back-office', 'inscription-premium' ), get_current_user_id() );

		do_action( 'inscription_premium_subscription_updated', $user_id );

		wp_safe_redirect( add_query_arg( array( 'page' => 'ip-subscribers', 'action' => 'edit', 'user_id' => $user_id, 'updated' => 1 ), admin_url( 'admin.php' ) ) );
		exit;
	}

	private function render_edit_page() {
		$user_id = (int) ( $_GET['user_id'] ?? 0 );
		$user    = get_userdata( $user_id );

		if ( ! $user ) {
			wp_die( esc_html__( 'Utilisateur introuvable.', 'inscription-premium' ) );
		}

		$status  = get_user_meta( $user_id, 'ip_subscription_status', true ) ?: 'none';
		$expiry  = get_user_meta( $user_id, 'ip_subscription_expiry', true );
		$plan    = get_user_meta( $user_id, 'ip_subscription_plan', true );
		$plans   = IP_Subscription::get_plans();
		$history = IP_Subscription_History::for_user( $user_id );
		$back_url = remove_query_arg( array( 'action', 'user_id', 'updated' ) );
		?>
		<div class="wrap ip-admin-subscriber-edit">
			<h1><?php printf( esc_html__( 'Abonné : %s', 'inscription-premium' ), esc_html( $user->display_name ) ); ?></h1>
			<p><a href="<?php echo esc_url( $back_url ); ?>">&larr; <?php esc_html_e( 'Retour à la liste', 'inscription-premium' ); ?></a></p>

			<?php if ( ! empty( $_GET['updated'] ) ) : ?>
				<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Abonnement mis à jour.', 'inscription-premium' ); ?></p></div>
			<?php endif; ?>

			<div class="ip-edit-columns">
				<form method="post" class="ip-edit-form">
					<input type="hidden" name="user_id" value="<?php echo esc_attr( $user_id ); ?>" />
					<?php wp_nonce_field( 'ip_edit_subscriber_' . $user_id, 'ip_edit_nonce' ); ?>

					<table class="form-table">
						<tr>
							<th><label for="ip_status"><?php esc_html_e( 'Statut', 'inscription-premium' ); ?></label></th>
							<td>
								<select id="ip_status" name="ip_status">
									<?php foreach ( array( 'active', 'expired', 'suspended', 'none' ) as $status_option ) : ?>
										<option value="<?php echo esc_attr( $status_option ); ?>" <?php selected( $status, $status_option ); ?>><?php echo esc_html( ucfirst( $status_option ) ); ?></option>
									<?php endforeach; ?>
								</select>
							</td>
						</tr>
						<tr>
							<th><label for="ip_expiry"><?php esc_html_e( 'Date d\'expiration', 'inscription-premium' ); ?></label></th>
							<td><input type="date" id="ip_expiry" name="ip_expiry" value="<?php echo esc_attr( $expiry ); ?>" /></td>
						</tr>
						<tr>
							<th><label for="ip_plan"><?php esc_html_e( 'Offre associée', 'inscription-premium' ); ?></label></th>
							<td>
								<select id="ip_plan" name="ip_plan">
									<option value=""><?php esc_html_e( '— Aucune —', 'inscription-premium' ); ?></option>
									<?php foreach ( $plans as $plan_key => $plan_data ) : ?>
										<option value="<?php echo esc_attr( $plan_key ); ?>" <?php selected( $plan, $plan_key ); ?>><?php echo esc_html( $plan_data['label'] ); ?></option>
									<?php endforeach; ?>
								</select>
							</td>
						</tr>
						<tr>
							<th><label for="ip_note"><?php esc_html_e( 'Note interne', 'inscription-premium' ); ?></label></th>
							<td><textarea id="ip_note" name="ip_note" rows="3" class="large-text" placeholder="<?php esc_attr_e( 'ex: geste commercial, paiement par virement…', 'inscription-premium' ); ?>"></textarea></td>
						</tr>
					</table>

					<p><button type="submit" name="ip_edit_submit" value="1" class="button button-primary"><?php esc_html_e( 'Enregistrer', 'inscription-premium' ); ?></button></p>
				</form>

				<div class="ip-edit-history">
					<h2><?php esc_html_e( 'Historique', 'inscription-premium' ); ?></h2>
					<table class="widefat striped">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Date', 'inscription-premium' ); ?></th>
								<th><?php esc_html_e( 'Action', 'inscription-premium' ); ?></th>
								<th><?php esc_html_e( 'Montant', 'inscription-premium' ); ?></th>
								<th><?php esc_html_e( 'Moyen', 'inscription-premium' ); ?></th>
								<th><?php esc_html_e( 'Note', 'inscription-premium' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( empty( $history ) ) : ?>
								<tr><td colspan="5"><?php esc_html_e( 'Aucun historique.', 'inscription-premium' ); ?></td></tr>
							<?php endif; ?>
							<?php foreach ( $history as $row ) : ?>
								<tr>
									<td><?php echo esc_html( $row->created_at ); ?></td>
									<td><?php echo esc_html( $row->action_type ); ?></td>
									<td><?php echo null !== $row->amount ? esc_html( ip_format_price( $row->amount ) ) : '—'; ?></td>
									<td><?php echo esc_html( $row->payment_method ?: '—' ); ?></td>
									<td><?php echo esc_html( $row->note ); ?></td>
								</tr>
							<?php endforeach; ?>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<?php
	}

	/* ---------------------------------------------------------------------
	 * Export CSV
	 * ------------------------------------------------------------------ */

	public static function export_url() {
		$url = add_query_arg( array_merge( $_GET, array( 'page' => 'ip-subscribers', 'ip_export' => 1 ) ), admin_url( 'admin.php' ) );

		return wp_nonce_url( $url, 'ip_export_subscribers' );
	}

	public function maybe_export_csv() {
		if ( ! $this->is_subscribers_screen() || empty( $_GET['ip_export'] ) ) {
			return;
		}

		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		check_admin_referer( 'ip_export_subscribers' );

		$args = array(
			'number' => -1,
			'fields' => array( 'ID', 'display_name', 'user_email', 'user_registered' ),
		);

		$search = trim( sanitize_text_field( $_GET['s'] ?? '' ) );

		if ( $search ) {
			$args['search']         = '*' . $search . '*';
			$args['search_columns'] = array( 'user_login', 'user_email', 'display_name' );
		}

		$status = sanitize_key( $_GET['ip_status'] ?? '' );
		$plan   = sanitize_key( $_GET['ip_plan'] ?? '' );

		if ( $status && 'expiring_soon' !== $status ) {
			$args['meta_query'][] = array( 'key' => 'ip_subscription_status', 'value' => $status );
		}

		if ( $plan ) {
			$args['meta_query'][] = array( 'key' => 'ip_subscription_plan', 'value' => $plan );
		}

		$users = ( new WP_User_Query( $args ) )->get_results();

		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=abonnes-inscription-premium-' . gmdate( 'Y-m-d' ) . '.csv' );

		$output = fopen( 'php://output', 'w' );
		fputcsv( $output, array( 'ID', 'Nom', 'Email', 'Inscription', 'Statut', 'Expiration', 'Offre' ) );

		foreach ( $users as $user ) {
			fputcsv( $output, array(
				$user->ID,
				$user->display_name,
				$user->user_email,
				mysql2date( 'Y-m-d', $user->user_registered ),
				get_user_meta( $user->ID, 'ip_subscription_status', true ) ?: 'none',
				get_user_meta( $user->ID, 'ip_subscription_expiry', true ),
				get_user_meta( $user->ID, 'ip_subscription_plan', true ),
			) );
		}

		fclose( $output );
		exit;
	}
}
