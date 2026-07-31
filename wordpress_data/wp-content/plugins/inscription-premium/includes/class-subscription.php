<?php
/**
 * Statut d'abonnement (user meta ip_subscription_status / ip_subscription_expiry),
 * shortcode [inscription_premium_plans], cron d'expiration.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Subscription {

	const CRON_HOOK = 'inscription_premium_check_expirations';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		add_shortcode( 'inscription_premium_plans', array( $this, 'render_plans_shortcode' ) );
		add_action( self::CRON_HOOK, array( __CLASS__, 'run_expiration_check' ) );
		add_action( 'wp_ajax_ip_subscribe_plan', array( $this, 'handle_subscribe_ajax' ) );
	}

	public static function schedule_cron() {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time(), 'daily', self::CRON_HOOK );
		}
	}

	public static function unschedule_cron() {
		$timestamp = wp_next_scheduled( self::CRON_HOOK );

		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CRON_HOOK );
		}
	}

	public static function run_expiration_check() {
		$users = get_users( array(
			'meta_key'   => 'ip_subscription_status',
			'meta_value' => 'active',
			'fields'     => 'ID',
		) );

		$today = current_time( 'Y-m-d' );

		foreach ( $users as $user_id ) {
			$expiry = get_user_meta( $user_id, 'ip_subscription_expiry', true );

			if ( $expiry && $expiry < $today ) {
				update_user_meta( $user_id, 'ip_subscription_status', 'expired' );
				do_action( 'inscription_premium_subscription_expired', $user_id );
			}
		}
	}

	/**
	 * @return array<string,array{label:string,duration_days:int,price:float}>
	 */
	public static function get_plans() {
		$default_plans = array(
			'monthly' => array(
				'label'         => __( 'Mensuel', 'inscription-premium' ),
				'duration_days' => 30,
				'price'         => (float) get_option( 'ip_plan_monthly_price', 19 ),
			),
			'yearly'  => array(
				'label'         => __( 'Annuel', 'inscription-premium' ),
				'duration_days' => 365,
				'price'         => (float) get_option( 'ip_plan_yearly_price', 190 ),
			),
		);

		return apply_filters( 'inscription_premium_plans', $default_plans );
	}

	public static function get_status( $user_id ) {
		return get_user_meta( $user_id, 'ip_subscription_status', true ) ?: 'none';
	}

	public static function is_active( $user_id ) {
		$status = self::get_status( $user_id );

		if ( 'active' !== $status ) {
			return false;
		}

		$expiry = get_user_meta( $user_id, 'ip_subscription_expiry', true );

		return ! $expiry || $expiry >= current_time( 'Y-m-d' );
	}

	public static function activate( $user_id, $plan_key, $duration_days = null, $note = '' ) {
		$plans = self::get_plans();
		$plan  = $plans[ $plan_key ] ?? null;
		$days  = $duration_days ?: ( $plan['duration_days'] ?? 30 );

		update_user_meta( $user_id, 'ip_subscription_status', 'active' );
		update_user_meta( $user_id, 'ip_subscription_plan', $plan_key );
		update_user_meta( $user_id, 'ip_subscription_expiry', gmdate( 'Y-m-d', strtotime( "+{$days} days" ) ) );

		IP_Subscription_History::log( $user_id, 'activation', $plan['price'] ?? null, null, $note );

		do_action( 'inscription_premium_subscription_updated', $user_id );
	}

	/**
	 * Le tunnel exige-t-il un abonnement actif pour publier une annonce ?
	 * Filtrable via `inscription_premium_requires_subscription` (ex: pour
	 * passer à un modèle "paiement à l'annonce" géré uniquement à l'étape 5).
	 */
	public static function requires_subscription() {
		return (bool) apply_filters( 'inscription_premium_requires_subscription', true );
	}

	public static function can_access_tunnel( $user_id ) {
		if ( ! self::requires_subscription() ) {
			return true;
		}

		return self::is_active( $user_id );
	}

	public function render_plans_shortcode() {
		wp_enqueue_style( 'ip-tunnel' );
		wp_enqueue_script( 'ip-tunnel' );

		$plans          = self::get_plans();
		$user_id        = get_current_user_id();
		$current_plan   = $user_id ? get_user_meta( $user_id, 'ip_subscription_plan', true ) : '';
		$current_active = $user_id && self::is_active( $user_id );

		ob_start();
		?>
		<div class="ip-plans-grid">
			<?php foreach ( $plans as $plan_key => $plan ) : ?>
				<div class="ip-plan-card <?php echo $current_active && $current_plan === $plan_key ? 'ip-plan-current' : ''; ?>">
					<h3><?php echo esc_html( $plan['label'] ); ?></h3>
					<p class="ip-plan-price"><?php echo esc_html( number_format_i18n( $plan['price'], 2 ) ); ?> €</p>
					<p class="ip-plan-duration"><?php printf( esc_html__( 'valable %d jours', 'inscription-premium' ), (int) $plan['duration_days'] ); ?></p>
					<?php if ( $current_active && $current_plan === $plan_key ) : ?>
						<span class="ip-badge ip-badge-active"><?php esc_html_e( 'Abonnement actuel', 'inscription-premium' ); ?></span>
					<?php elseif ( is_user_logged_in() ) : ?>
						<button type="button" class="ip-btn ip-btn-primary ip-subscribe-btn" data-plan="<?php echo esc_attr( $plan_key ); ?>">
							<?php esc_html_e( 'Choisir cette offre', 'inscription-premium' ); ?>
						</button>
					<?php else : ?>
						<a class="ip-btn ip-btn-primary" href="<?php echo esc_url( IP_Auth::get_login_url() ); ?>">
							<?php esc_html_e( 'Se connecter pour souscrire', 'inscription-premium' ); ?>
						</a>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
		<?php

		return ob_get_clean();
	}

	/**
	 * Souscription "gratuite/de démonstration" côté AJAX admin-ajax : la
	 * facturation réelle de l'abonnement passe par la même abstraction de
	 * paiement que le tunnel (voir class-payment.php) si un tarif > 0 est
	 * configuré ; ce endpoint gère le cas gratuit et sert de point
	 * d'extension pour brancher un paiement dédié à l'abonnement.
	 */
	public function handle_subscribe_ajax() {
		check_ajax_referer( 'wp_rest', 'nonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( array( 'message' => __( 'Vous devez être connecté.', 'inscription-premium' ) ), 401 );
		}

		$plan_key = isset( $_POST['plan'] ) ? sanitize_key( wp_unslash( $_POST['plan'] ) ) : '';
		$plans    = self::get_plans();

		if ( ! isset( $plans[ $plan_key ] ) ) {
			wp_send_json_error( array( 'message' => __( 'Offre inconnue.', 'inscription-premium' ) ), 400 );
		}

		$plan = $plans[ $plan_key ];

		if ( $plan['price'] > 0 ) {
			wp_send_json_error( array( 'message' => __( 'Cette offre est payante, le paiement doit être finalisé via Stripe.', 'inscription-premium' ) ), 400 );
		}

		self::activate( get_current_user_id(), $plan_key, $plan['duration_days'], 'Souscription offre gratuite' );

		wp_send_json_success();
	}
}
