<?php
/**
 * WP_List_Table des abonnés : pagination, tri, recherche natifs.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class IP_Subscribers_List_Table extends WP_List_Table {

	public function __construct() {
		parent::__construct( array(
			'singular' => 'subscriber',
			'plural'   => 'subscribers',
			'ajax'     => false,
		) );
	}

	public function get_columns() {
		return array(
			'cb'          => '<input type="checkbox" />',
			'name'        => __( 'Abonné', 'inscription-premium' ),
			'registered'  => __( 'Date d\'inscription', 'inscription-premium' ),
			'status'      => __( 'Statut', 'inscription-premium' ),
			'expiry'      => __( 'Expiration', 'inscription-premium' ),
			'plan'        => __( 'Offre', 'inscription-premium' ),
			'listings'    => __( 'Annonces', 'inscription-premium' ),
		);
	}

	public function get_sortable_columns() {
		return array(
			'registered' => array( 'registered', false ),
			'expiry'     => array( 'expiry', false ),
		);
	}

	public function get_bulk_actions() {
		return array(
			'extend_7'   => __( 'Prolonger de 7 jours', 'inscription-premium' ),
			'extend_30'  => __( 'Prolonger de 30 jours', 'inscription-premium' ),
			'suspend'    => __( 'Passer en Suspendu', 'inscription-premium' ),
			'reactivate' => __( 'Réactiver', 'inscription-premium' ),
			'remind'     => __( 'Envoyer un email de rappel d\'expiration', 'inscription-premium' ),
		);
	}

	public function column_cb( $item ) {
		return sprintf( '<input type="checkbox" name="user_ids[]" value="%d" />', $item->ID );
	}

	public function column_name( $item ) {
		$edit_url = add_query_arg( array( 'page' => 'ip-subscribers', 'action' => 'edit', 'user_id' => $item->ID ), admin_url( 'admin.php' ) );

		$actions = array(
			'edit'       => sprintf( '<a href="%s">%s</a>', esc_url( $edit_url ), esc_html__( 'Modifier', 'inscription-premium' ) ),
			'extend_30'  => sprintf( '<a href="%s">%s</a>', esc_url( IP_Admin_Subscribers::row_action_url( 'extend_30', $item->ID ) ), esc_html__( 'Prolonger', 'inscription-premium' ) ),
			'suspend'    => sprintf( '<a href="%s">%s</a>', esc_url( IP_Admin_Subscribers::row_action_url( 'suspend', $item->ID ) ), esc_html__( 'Suspendre', 'inscription-premium' ) ),
			'cancel'     => sprintf( '<a href="%s" class="ip-danger-link">%s</a>', esc_url( IP_Admin_Subscribers::row_action_url( 'cancel', $item->ID ) ), esc_html__( 'Annuler', 'inscription-premium' ) ),
		);

		return sprintf(
			'%s <strong><a href="%s">%s</a></strong><br /><span class="ip-subtle">%s</span>%s',
			get_avatar( $item->ID, 32 ),
			esc_url( get_edit_user_link( $item->ID ) ),
			esc_html( $item->display_name ),
			esc_html( $item->user_email ),
			$this->row_actions( $actions )
		);
	}

	public function column_registered( $item ) {
		return esc_html( mysql2date( 'Y-m-d', $item->user_registered ) );
	}

	public function column_status( $item ) {
		$status  = get_user_meta( $item->ID, 'ip_subscription_status', true ) ?: 'none';
		$expiry  = get_user_meta( $item->ID, 'ip_subscription_expiry', true );
		$badge   = IP_Admin_Subscribers::status_badge( $status, $expiry );

		return $badge;
	}

	public function column_expiry( $item ) {
		$expiry = get_user_meta( $item->ID, 'ip_subscription_expiry', true );

		return $expiry ? esc_html( $expiry ) : '—';
	}

	public function column_plan( $item ) {
		$plan_key = get_user_meta( $item->ID, 'ip_subscription_plan', true );

		if ( ! $plan_key ) {
			return '—';
		}

		$plans = IP_Subscription::get_plans();

		return esc_html( $plans[ $plan_key ]['label'] ?? $plan_key );
	}

	public function column_listings( $item ) {
		global $wpdb;

		$published = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_author = %d AND post_type = %s AND post_status = 'publish'",
			$item->ID,
			IP_BOAT_POD
		) );

		$drafts = (int) $wpdb->get_var( $wpdb->prepare(
			"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_author = %d AND post_type = %s AND post_status = 'draft'",
			$item->ID,
			IP_BOAT_POD
		) );

		return sprintf(
			/* translators: 1: published count, 2: draft count */
			esc_html__( '%1$d publiées / %2$d brouillons', 'inscription-premium' ),
			$published,
			$drafts
		);
	}

	public function column_default( $item, $column_name ) {
		return '';
	}

	public function extra_tablenav( $which ) {
		if ( 'top' !== $which ) {
			return;
		}

		$current_status = sanitize_key( $_GET['ip_status'] ?? '' );
		$current_plan   = sanitize_key( $_GET['ip_plan'] ?? '' );
		$plans          = IP_Subscription::get_plans();
		?>
		<div class="alignleft actions">
			<select name="ip_status">
				<option value=""><?php esc_html_e( 'Tous les statuts', 'inscription-premium' ); ?></option>
				<option value="active" <?php selected( $current_status, 'active' ); ?>><?php esc_html_e( 'Actif', 'inscription-premium' ); ?></option>
				<option value="expiring_soon" <?php selected( $current_status, 'expiring_soon' ); ?>><?php esc_html_e( 'Expire bientôt', 'inscription-premium' ); ?></option>
				<option value="expired" <?php selected( $current_status, 'expired' ); ?>><?php esc_html_e( 'Expiré', 'inscription-premium' ); ?></option>
				<option value="suspended" <?php selected( $current_status, 'suspended' ); ?>><?php esc_html_e( 'Suspendu', 'inscription-premium' ); ?></option>
			</select>

			<select name="ip_plan">
				<option value=""><?php esc_html_e( 'Toutes les offres', 'inscription-premium' ); ?></option>
				<?php foreach ( $plans as $plan_key => $plan ) : ?>
					<option value="<?php echo esc_attr( $plan_key ); ?>" <?php selected( $current_plan, $plan_key ); ?>><?php echo esc_html( $plan['label'] ); ?></option>
				<?php endforeach; ?>
			</select>

			<?php submit_button( __( 'Filtrer', 'inscription-premium' ), '', 'filter_action', false ); ?>

			<a class="button" href="<?php echo esc_url( IP_Admin_Subscribers::export_url() ); ?>"><?php esc_html_e( 'Exporter (CSV)', 'inscription-premium' ); ?></a>
		</div>
		<?php
	}

	public function prepare_items() {
		$per_page = 20;
		$paged    = $this->get_pagenum();

		$columns  = $this->get_columns();
		$hidden   = array();
		$sortable = $this->get_sortable_columns();
		$this->_column_headers = array( $columns, $hidden, $sortable );

		$args = array(
			'number' => $per_page,
			'offset' => ( $paged - 1 ) * $per_page,
			'fields' => array( 'ID', 'display_name', 'user_email', 'user_registered' ),
		);

		$search = trim( sanitize_text_field( $_GET['s'] ?? '' ) );

		if ( $search ) {
			$args['search']         = '*' . $search . '*';
			$args['search_columns'] = array( 'user_login', 'user_email', 'display_name' );
		}

		$status = sanitize_key( $_GET['ip_status'] ?? '' );
		$plan   = sanitize_key( $_GET['ip_plan'] ?? '' );

		$meta_query = array();

		if ( $status && 'expiring_soon' !== $status ) {
			$meta_query[] = array( 'key' => 'ip_subscription_status', 'value' => $status );
		} elseif ( 'expiring_soon' === $status ) {
			$meta_query[] = array( 'key' => 'ip_subscription_status', 'value' => 'active' );
			$meta_query[] = array(
				'key'     => 'ip_subscription_expiry',
				'value'   => array( current_time( 'Y-m-d' ), gmdate( 'Y-m-d', strtotime( '+7 days' ) ) ),
				'compare' => 'BETWEEN',
				'type'    => 'DATE',
			);
		}

		if ( $plan ) {
			$meta_query[] = array( 'key' => 'ip_subscription_plan', 'value' => $plan );
		}

		if ( ! empty( $meta_query ) ) {
			$args['meta_query'] = $meta_query;
		}

		$orderby = sanitize_key( $_GET['orderby'] ?? '' );
		$order   = 'asc' === strtolower( $_GET['order'] ?? '' ) ? 'ASC' : 'DESC';

		if ( 'registered' === $orderby ) {
			$args['orderby'] = 'user_registered';
			$args['order']   = $order;
		} elseif ( 'expiry' === $orderby ) {
			$args['orderby']  = 'meta_value';
			$args['meta_key'] = 'ip_subscription_expiry';
			$args['order']    = $order;
		} else {
			$args['orderby'] = 'registered';
			$args['order']   = 'DESC';
		}

		$user_query   = new WP_User_Query( $args );
		$this->items  = $user_query->get_results();
		$total_items  = $user_query->get_total();

		$this->set_pagination_args( array(
			'total_items' => $total_items,
			'per_page'    => $per_page,
			'total_pages' => ceil( $total_items / $per_page ),
		) );
	}
}
