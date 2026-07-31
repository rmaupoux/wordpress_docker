<?php
/**
 * Tunnel de dépôt d'annonce en 5 étapes.
 * Shortcode [inscription_premium_tunnel].
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Tunnel {

	const STEP_COUNT = 5;

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		add_shortcode( 'inscription_premium_tunnel', array( $this, 'render_tunnel_shortcode' ) );
	}

	public static function get_step_labels() {
		return array(
			1 => __( 'Type', 'inscription-premium' ),
			2 => __( 'Specifications', 'inscription-premium' ),
			3 => __( 'Pictures', 'inscription-premium' ),
			4 => __( 'Period of validity', 'inscription-premium' ),
			5 => __( 'Payment', 'inscription-premium' ),
		);
	}

	public static function get_step_url( $step, $tunnel_page_url = '' ) {
		$base = $tunnel_page_url ?: self::get_tunnel_page_url();

		return add_query_arg( 'ip_step', (int) $step, $base );
	}

	public static function get_tunnel_page_url() {
		$page_id = (int) get_option( 'ip_tunnel_page_id' );

		return $page_id ? get_permalink( $page_id ) : home_url( '/' );
	}

	/**
	 * Draft courant de l'utilisateur, stocké en user meta temporaire
	 * (clé `ip_draft_{user_id}`) au format JSON, tant que l'annonce n'est
	 * pas encore créée dans Pods.
	 */
	public static function get_draft( $user_id ) {
		$raw = get_user_meta( $user_id, 'ip_draft_' . $user_id, true );

		if ( ! $raw ) {
			return self::empty_draft();
		}

		$data = json_decode( $raw, true );

		return is_array( $data ) ? wp_parse_args( $data, self::empty_draft() ) : self::empty_draft();
	}

	private static function empty_draft() {
		return array(
			'type'          => 0,
			'general'       => array(),
			'engine'        => array(),
			'layout'        => array(),
			'price'         => array(),
			'contact'       => array(),
			'photo_ids'     => array(),
			'listing_id'    => 0,
			'contact_id'    => 0,
			'duration_days' => 0,
			'addons'        => array(),
		);
	}

	public static function save_draft( $user_id, array $data ) {
		update_user_meta( $user_id, 'ip_draft_' . $user_id, wp_json_encode( $data ) );
	}

	public static function clear_draft( $user_id ) {
		delete_user_meta( $user_id, 'ip_draft_' . $user_id );
	}

	public static function get_highest_completed_step( array $draft ) {
		if ( ! empty( $draft['listing_id'] ) && ! empty( $draft['duration_days'] ) ) {
			return 4;
		}

		if ( ! empty( $draft['listing_id'] ) ) {
			return 3;
		}

		if ( ! empty( $draft['general'] ) ) {
			return 2;
		}

		if ( ! empty( $draft['type'] ) ) {
			return 1;
		}

		return 0;
	}

	public function render_tunnel_shortcode() {
		wp_enqueue_style( 'ip-tunnel' );
		wp_enqueue_script( 'ip-tunnel' );

		$tunnel_url = get_permalink();

		if ( ! is_user_logged_in() ) {
			return $this->render_gate_message(
				__( 'Vous devez être connecté pour déposer une annonce.', 'inscription-premium' ),
				IP_Auth::get_login_url( $tunnel_url )
			);
		}

		$user_id = get_current_user_id();

		if ( ! IP_Subscription::can_access_tunnel( $user_id ) ) {
			return $this->render_gate_message(
				__( 'Un abonnement actif est requis pour déposer une annonce.', 'inscription-premium' ),
				home_url( '/' ),
				__( 'Voir les offres', 'inscription-premium' )
			);
		}

		$draft          = self::get_draft( $user_id );
		$requested_step = isset( $_GET['ip_step'] ) ? max( 1, min( self::STEP_COUNT, (int) $_GET['ip_step'] ) ) : 1;
		$max_allowed    = self::get_highest_completed_step( $draft ) + 1;
		$step           = min( $requested_step, $max_allowed );

		ob_start();
		$this->render_stepper( $step );

		switch ( $step ) {
			case 1:
				include IP_PATH . 'templates/step-1-type.php';
				break;

			case 2:
				include IP_PATH . 'templates/step-2-specifications.php';
				break;

			case 3:
				include IP_PATH . 'templates/step-3-pictures.php';
				break;

			case 4:
				include IP_PATH . 'templates/step-4-validity.php';
				break;

			case 5:
				include IP_PATH . 'templates/step-5-payment.php';
				break;
		}

		return ob_get_clean();
	}

	private function render_gate_message( $message, $cta_url, $cta_label = '' ) {
		ob_start();
		?>
		<div class="ip-tunnel-gate">
			<p><?php echo esc_html( $message ); ?></p>
			<a class="ip-btn ip-btn-primary" href="<?php echo esc_url( $cta_url ); ?>">
				<?php echo esc_html( $cta_label ?: __( 'Se connecter', 'inscription-premium' ) ); ?>
			</a>
		</div>
		<?php
		return ob_get_clean();
	}

	private function render_stepper( $current_step ) {
		$labels = self::get_step_labels();
		?>
		<ol class="ip-stepper">
			<?php foreach ( $labels as $number => $label ) :
				$state = 'upcoming';

				if ( $number < $current_step ) {
					$state = 'complete';
				} elseif ( $number === $current_step ) {
					$state = 'active';
				}
				?>
				<li class="ip-stepper-item ip-stepper-<?php echo esc_attr( $state ); ?>">
					<span class="ip-stepper-circle"><?php echo esc_html( $number ); ?></span>
					<span class="ip-stepper-label"><?php echo esc_html( $label ); ?></span>
				</li>
			<?php endforeach; ?>
		</ol>
		<?php if ( $current_step > 1 ) : ?>
			<a class="ip-btn ip-btn-secondary ip-tunnel-return" href="<?php echo esc_url( self::get_step_url( $current_step - 1 ) ); ?>">
				&larr; <?php esc_html_e( 'Return', 'inscription-premium' ); ?>
			</a>
		<?php endif; ?>
		<?php
	}
}
