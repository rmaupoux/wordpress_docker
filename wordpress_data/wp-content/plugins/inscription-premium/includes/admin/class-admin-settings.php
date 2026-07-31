<?php
/**
 * Menu "Inscription Premium" : réglages généraux + suivi des annonces en
 * brouillon (tunnel non terminé). Le sous-menu "Abonnés" est ajouté par
 * IP_Admin_Subscribers (class-admin-subscribers.php).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Admin_Settings {

	const CAPABILITY = 'manage_ip_subscriptions';
	const OPTION_GROUP = 'ip_settings';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		// Priorité 5 : ce menu crée la page de niveau supérieur "inscription-premium"
		// et doit être le premier sous-menu enregistré pour ce parent, sans quoi
		// WordPress fait pointer le lien du menu principal vers un autre sous-menu.
		add_action( 'admin_menu', array( $this, 'register_menu' ), 5 );
	}

	public function register_menu() {
		add_menu_page(
			__( 'Inscription Premium', 'inscription-premium' ),
			__( 'Inscription Premium', 'inscription-premium' ),
			self::CAPABILITY,
			'inscription-premium',
			array( $this, 'render_settings_page' ),
			'dashicons-tickets-alt',
			56
		);

		add_submenu_page(
			'inscription-premium',
			__( 'Réglages', 'inscription-premium' ),
			__( 'Réglages', 'inscription-premium' ),
			self::CAPABILITY,
			'inscription-premium',
			array( $this, 'render_settings_page' )
		);

		add_submenu_page(
			'inscription-premium',
			__( 'Annonces en brouillon', 'inscription-premium' ),
			__( 'Annonces en brouillon', 'inscription-premium' ),
			self::CAPABILITY,
			'ip-draft-listings',
			array( $this, 'render_drafts_page' )
		);
	}

	private function get_option_fields() {
		return array(
			'ip_stripe_publishable_key' => 'sanitize_text_field',
			'ip_stripe_secret_key'      => 'sanitize_text_field',
			'ip_stripe_webhook_secret'  => 'sanitize_text_field',
			'ip_auth_page_id'           => 'absint',
			'ip_tunnel_page_id'         => 'absint',
			'ip_duration_recommended'   => 'absint',
			'ip_duration_30_price'      => 'floatval',
			'ip_duration_60_price'      => 'floatval',
			'ip_duration_90_price'      => 'floatval',
			'ip_highlights_price'       => 'floatval',
			'ip_plan_monthly_price'     => 'floatval',
			'ip_plan_yearly_price'      => 'floatval',
		);
	}

	public function render_settings_page() {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		if ( ! empty( $_POST['ip_settings_submit'] ) ) {
			check_admin_referer( 'ip_save_settings', 'ip_settings_nonce' );

			foreach ( $this->get_option_fields() as $option => $sanitizer ) {
				$value = wp_unslash( $_POST[ $option ] ?? '' );
				update_option( $option, call_user_func( $sanitizer, $value ) );
			}

			echo '<div class="notice notice-success"><p>' . esc_html__( 'Réglages enregistrés.', 'inscription-premium' ) . '</p></div>';
		}

		$pages = get_pages();
		?>
		<div class="wrap ip-admin-settings">
			<h1><?php esc_html_e( 'Inscription Premium — Réglages', 'inscription-premium' ); ?></h1>

			<form method="post">
				<?php wp_nonce_field( 'ip_save_settings', 'ip_settings_nonce' ); ?>

				<h2><?php esc_html_e( 'Pages', 'inscription-premium' ); ?></h2>
				<table class="form-table">
					<tr>
						<th><label for="ip_auth_page_id"><?php esc_html_e( 'Page contenant [inscription_premium_auth]', 'inscription-premium' ); ?></label></th>
						<td><?php $this->render_page_select( 'ip_auth_page_id', $pages ); ?></td>
					</tr>
					<tr>
						<th><label for="ip_tunnel_page_id"><?php esc_html_e( 'Page contenant [inscription_premium_tunnel]', 'inscription-premium' ); ?></label></th>
						<td><?php $this->render_page_select( 'ip_tunnel_page_id', $pages ); ?></td>
					</tr>
				</table>

				<h2><?php esc_html_e( 'Stripe', 'inscription-premium' ); ?></h2>
				<table class="form-table">
					<tr>
						<th><label for="ip_stripe_publishable_key"><?php esc_html_e( 'Clé publique', 'inscription-premium' ); ?></label></th>
						<td><input type="text" class="regular-text" id="ip_stripe_publishable_key" name="ip_stripe_publishable_key" value="<?php echo esc_attr( get_option( 'ip_stripe_publishable_key', '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th><label for="ip_stripe_secret_key"><?php esc_html_e( 'Clé secrète', 'inscription-premium' ); ?></label></th>
						<td><input type="password" class="regular-text" id="ip_stripe_secret_key" name="ip_stripe_secret_key" value="<?php echo esc_attr( get_option( 'ip_stripe_secret_key', '' ) ); ?>" autocomplete="off" /></td>
					</tr>
					<tr>
						<th><label for="ip_stripe_webhook_secret"><?php esc_html_e( 'Secret webhook', 'inscription-premium' ); ?></label></th>
						<td>
							<input type="password" class="regular-text" id="ip_stripe_webhook_secret" name="ip_stripe_webhook_secret" value="<?php echo esc_attr( get_option( 'ip_stripe_webhook_secret', '' ) ); ?>" autocomplete="off" />
							<p class="description">
								<?php
								printf(
									/* translators: %s: webhook URL */
									esc_html__( 'URL à configurer côté Stripe : %s', 'inscription-premium' ),
									'<code>' . esc_html( rest_url( 'inscription-premium/v1/stripe-webhook' ) ) . '</code>'
								);
								?>
							</p>
						</td>
					</tr>
				</table>

				<h2><?php esc_html_e( 'Durée de publication du tunnel', 'inscription-premium' ); ?></h2>
				<table class="form-table">
					<tr>
						<th><label for="ip_duration_30_price"><?php esc_html_e( 'Tarif 30 jours', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_duration_30_price" name="ip_duration_30_price" value="<?php echo esc_attr( get_option( 'ip_duration_30_price', 29 ) ); ?>" /></td>
					</tr>
					<tr>
						<th><label for="ip_duration_60_price"><?php esc_html_e( 'Tarif 60 jours', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_duration_60_price" name="ip_duration_60_price" value="<?php echo esc_attr( get_option( 'ip_duration_60_price', 49 ) ); ?>" /></td>
					</tr>
					<tr>
						<th><label for="ip_duration_90_price"><?php esc_html_e( 'Tarif 90 jours', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_duration_90_price" name="ip_duration_90_price" value="<?php echo esc_attr( get_option( 'ip_duration_90_price', 69 ) ); ?>" /></td>
					</tr>
					<tr>
						<th><label for="ip_duration_recommended"><?php esc_html_e( 'Durée mise en avant "Recommandé"', 'inscription-premium' ); ?></label></th>
						<td>
							<select id="ip_duration_recommended" name="ip_duration_recommended">
								<?php foreach ( array( 30, 60, 90 ) as $days ) : ?>
									<option value="<?php echo esc_attr( $days ); ?>" <?php selected( (int) get_option( 'ip_duration_recommended', 60 ), $days ); ?>><?php echo esc_html( $days ); ?></option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
					<tr>
						<th><label for="ip_highlights_price"><?php esc_html_e( 'Supplément option Highlights', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_highlights_price" name="ip_highlights_price" value="<?php echo esc_attr( get_option( 'ip_highlights_price', 15 ) ); ?>" /></td>
					</tr>
				</table>

				<h2><?php esc_html_e( 'Offres d\'abonnement', 'inscription-premium' ); ?></h2>
				<table class="form-table">
					<tr>
						<th><label for="ip_plan_monthly_price"><?php esc_html_e( 'Tarif mensuel', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_plan_monthly_price" name="ip_plan_monthly_price" value="<?php echo esc_attr( get_option( 'ip_plan_monthly_price', 19 ) ); ?>" /></td>
					</tr>
					<tr>
						<th><label for="ip_plan_yearly_price"><?php esc_html_e( 'Tarif annuel', 'inscription-premium' ); ?></label></th>
						<td><input type="number" step="0.01" id="ip_plan_yearly_price" name="ip_plan_yearly_price" value="<?php echo esc_attr( get_option( 'ip_plan_yearly_price', 190 ) ); ?>" /></td>
					</tr>
				</table>

				<p><button type="submit" name="ip_settings_submit" value="1" class="button button-primary"><?php esc_html_e( 'Enregistrer', 'inscription-premium' ); ?></button></p>
			</form>
		</div>
		<?php
	}

	private function render_page_select( $name, $pages ) {
		?>
		<select id="<?php echo esc_attr( $name ); ?>" name="<?php echo esc_attr( $name ); ?>">
			<option value="0"><?php esc_html_e( '— Choisir une page —', 'inscription-premium' ); ?></option>
			<?php foreach ( $pages as $page ) : ?>
				<option value="<?php echo esc_attr( $page->ID ); ?>" <?php selected( (int) get_option( $name ), $page->ID ); ?>>
					<?php echo esc_html( $page->post_title ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	public function render_drafts_page() {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'Accès refusé.', 'inscription-premium' ) );
		}

		$query = new WP_Query( array(
			'post_type'      => IP_BOAT_POD,
			'post_status'    => 'draft',
			'meta_key'       => 'ip_owner_user_id',
			'posts_per_page' => 50,
			'orderby'        => 'date',
			'order'          => 'DESC',
		) );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Annonces en brouillon (tunnel non terminé)', 'inscription-premium' ); ?></h1>

			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Titre', 'inscription-premium' ); ?></th>
						<th><?php esc_html_e( 'Auteur', 'inscription-premium' ); ?></th>
						<th><?php esc_html_e( 'Créée le', 'inscription-premium' ); ?></th>
						<th><?php esc_html_e( 'Actions', 'inscription-premium' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php if ( ! $query->have_posts() ) : ?>
						<tr><td colspan="4"><?php esc_html_e( 'Aucune annonce en brouillon.', 'inscription-premium' ); ?></td></tr>
					<?php endif; ?>

					<?php while ( $query->have_posts() ) : $query->the_post(); ?>
						<tr>
							<td><?php the_title(); ?></td>
							<td><?php echo esc_html( get_the_author() ); ?></td>
							<td><?php echo esc_html( get_the_date() ); ?></td>
							<td><a href="<?php echo esc_url( get_edit_post_link() ); ?>"><?php esc_html_e( 'Voir dans Pods', 'inscription-premium' ); ?></a></td>
						</tr>
					<?php endwhile; wp_reset_postdata(); ?>
				</tbody>
			</table>
		</div>
		<?php
	}
}
