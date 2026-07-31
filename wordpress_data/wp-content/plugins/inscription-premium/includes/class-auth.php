<?php
/**
 * Inscription / connexion / déconnexion / mot de passe oublié en front-end.
 * Shortcode [inscription_premium_auth].
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Auth {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		add_shortcode( 'inscription_premium_auth', array( $this, 'render_auth_shortcode' ) );
		add_action( 'init', array( $this, 'handle_form_submissions' ) );
	}

	/**
	 * URL de la page portant le shortcode [inscription_premium_auth], utilisée
	 * pour rediriger un visiteur non connecté qui tente d'accéder au tunnel.
	 * L'URL de destination voyage en query arg `redirect_to` puis en champ
	 * caché du formulaire (pas de dépendance aux sessions PHP natives, pour
	 * rester compatible avec le cache de page).
	 */
	public static function get_login_url( $redirect_to = '' ) {
		$auth_page_id = (int) get_option( 'ip_auth_page_id' );
		$base_url     = $auth_page_id ? get_permalink( $auth_page_id ) : home_url( '/' );

		if ( $redirect_to ) {
			$base_url = add_query_arg( 'redirect_to', rawurlencode( $redirect_to ), $base_url );
		}

		return $base_url;
	}

	public function handle_form_submissions() {
		if ( empty( $_POST['ip_auth_action'] ) ) {
			return;
		}

		$action = sanitize_key( wp_unslash( $_POST['ip_auth_action'] ) );

		switch ( $action ) {
			case 'register':
				$this->handle_register();
				break;

			case 'login':
				$this->handle_login();
				break;

			case 'lost_password':
				$this->handle_lost_password();
				break;
		}
	}

	private function handle_register() {
		if ( ! isset( $_POST['ip_auth_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['ip_auth_nonce'] ), 'ip_auth_register' ) ) {
			$this->redirect_with_error( 'invalid_nonce' );
		}

		$email    = sanitize_email( wp_unslash( $_POST['ip_email'] ?? '' ) );
		$password = (string) ( $_POST['ip_password'] ?? '' );
		$name     = sanitize_text_field( wp_unslash( $_POST['ip_name'] ?? '' ) );

		if ( ! is_email( $email ) || strlen( $password ) < 8 || '' === $name ) {
			$this->redirect_with_error( 'invalid_fields' );
		}

		if ( email_exists( $email ) ) {
			$this->redirect_with_error( 'email_exists' );
		}

		$username = sanitize_user( current( explode( '@', $email ) ) . '_' . wp_generate_password( 4, false ) );

		$user_id = wp_insert_user( array(
			'user_login'   => $username,
			'user_email'   => $email,
			'user_pass'    => $password,
			'display_name' => $name,
			'role'         => 'subscriber',
		) );

		if ( is_wp_error( $user_id ) ) {
			$this->redirect_with_error( 'registration_failed' );
		}

		update_user_meta( $user_id, 'ip_subscription_status', 'none' );

		/**
		 * Permet de brancher un email de confirmation (facultatif, cf. README).
		 */
		do_action( 'inscription_premium_user_registered', $user_id, $email );

		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id, true );

		$this->redirect_after_auth();
	}

	private function handle_login() {
		if ( ! isset( $_POST['ip_auth_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['ip_auth_nonce'] ), 'ip_auth_login' ) ) {
			$this->redirect_with_error( 'invalid_nonce' );
		}

		$creds = array(
			'user_login'    => sanitize_text_field( wp_unslash( $_POST['ip_login'] ?? '' ) ),
			'user_password' => (string) ( $_POST['ip_password'] ?? '' ),
			'remember'      => true,
		);

		$user = wp_signon( $creds, is_ssl() );

		if ( is_wp_error( $user ) ) {
			$this->redirect_with_error( 'login_failed' );
		}

		$this->redirect_after_auth();
	}

	private function handle_lost_password() {
		if ( ! isset( $_POST['ip_auth_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['ip_auth_nonce'] ), 'ip_auth_lost_password' ) ) {
			$this->redirect_with_error( 'invalid_nonce' );
		}

		$email = sanitize_email( wp_unslash( $_POST['ip_email'] ?? '' ) );
		$user  = get_user_by( 'email', $email );

		if ( $user ) {
			retrieve_password( $user->user_login );
		}

		// Toujours le même message, qu'un compte existe ou non (pas de fuite d'info).
		$redirect = add_query_arg( 'ip_notice', 'lost_password_sent', wp_get_referer() ?: home_url( '/' ) );
		wp_safe_redirect( $redirect );
		exit;
	}

	private function redirect_after_auth() {
		$target = ! empty( $_POST['ip_redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['ip_redirect_to'] ) ) : '';

		wp_safe_redirect( $target ?: home_url( '/' ) );
		exit;
	}

	private function redirect_with_error( $code ) {
		$redirect = add_query_arg( 'ip_error', $code, wp_get_referer() ?: home_url( '/' ) );
		wp_safe_redirect( $redirect );
		exit;
	}

	public function render_auth_shortcode( $atts ) {
		if ( is_user_logged_in() ) {
			ob_start();
			$user = wp_get_current_user();
			?>
			<div class="ip-auth-logged-in">
				<p><?php printf( esc_html__( 'Connecté en tant que %s.', 'inscription-premium' ), esc_html( $user->display_name ) ); ?></p>
				<a class="ip-btn ip-btn-secondary" href="<?php echo esc_url( wp_logout_url( home_url( '/' ) ) ); ?>">
					<?php esc_html_e( 'Se déconnecter', 'inscription-premium' ); ?>
				</a>
			</div>
			<?php
			return ob_get_clean();
		}

		wp_enqueue_script( 'ip-tunnel' );

		$redirect_to = isset( $_GET['redirect_to'] ) ? esc_url_raw( wp_unslash( $_GET['redirect_to'] ) ) : '';
		$error       = isset( $_GET['ip_error'] ) ? sanitize_key( wp_unslash( $_GET['ip_error'] ) ) : '';
		$notice      = isset( $_GET['ip_notice'] ) ? sanitize_key( wp_unslash( $_GET['ip_notice'] ) ) : '';

		ob_start();
		include IP_PATH . 'templates/auth-form.php';

		return ob_get_clean();
	}
}
