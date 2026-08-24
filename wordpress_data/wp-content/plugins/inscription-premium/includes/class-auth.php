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
			$this->redirect_with_error( 'invalid_nonce', 'register' );
		}

		$email    = sanitize_email( wp_unslash( $_POST['ip_email'] ?? '' ) );
		$password = (string) ( $_POST['ip_password'] ?? '' );
		$name     = sanitize_text_field( wp_unslash( $_POST['ip_name'] ?? '' ) );
		$prefill  = array(
			'ip_email' => $email,
			'ip_name'  => $name,
		);

		if ( ! is_email( $email ) || strlen( $password ) < 8 || '' === $name ) {
			$this->redirect_with_error( 'invalid_fields', 'register', $prefill );
		}

		if ( email_exists( $email ) ) {
			$this->redirect_with_error( 'email_exists', 'register', $prefill );
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
			$this->redirect_with_error( 'registration_failed', 'register', $prefill );
		}

		update_user_meta( $user_id, 'ip_subscription_status', 'none' );

		/**
		 * Permet de brancher un email de confirmation (facultatif, cf. README).
		 */
		do_action( 'inscription_premium_user_registered', $user_id, $email );

		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id, true );

		$this->redirect_after_auth( 'register_success' );
	}

	private function handle_login() {
		if ( ! isset( $_POST['ip_auth_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['ip_auth_nonce'] ), 'ip_auth_login' ) ) {
			$this->redirect_with_error( 'invalid_nonce', 'login' );
		}

		$creds = array(
			'user_login'    => sanitize_text_field( wp_unslash( $_POST['ip_login'] ?? '' ) ),
			'user_password' => (string) ( $_POST['ip_password'] ?? '' ),
			'remember'      => true,
		);

		$user = wp_signon( $creds, is_ssl() );

		if ( is_wp_error( $user ) ) {
			$this->redirect_with_error( 'login_failed', 'login', array( 'ip_login' => $creds['user_login'] ) );
		}

		$this->redirect_after_auth( 'login_success' );
	}

	private function handle_lost_password() {
		if ( ! isset( $_POST['ip_auth_nonce'] ) || ! wp_verify_nonce( wp_unslash( $_POST['ip_auth_nonce'] ), 'ip_auth_lost_password' ) ) {
			$this->redirect_with_error( 'invalid_nonce', 'lost_password' );
		}

		$email = sanitize_email( wp_unslash( $_POST['ip_email'] ?? '' ) );
		$user  = get_user_by( 'email', $email );

		if ( $user ) {
			retrieve_password( $user->user_login );
		}

		// Toujours le même message, qu'un compte existe ou non (pas de fuite d'info).
		$redirect = add_query_arg( 'ip_notice', 'lost_password_sent', $this->get_return_url() );
		wp_safe_redirect( $redirect );
		exit;
	}

	/**
	 * $notice n'est appliqué que si aucune destination explicite n'a été
	 * fournie (ip_redirect_to) : ce champ signifie que l'internaute a été
	 * envoyé ici pour continuer une action (ex. accéder au tunnel non
	 * connecté), auquel cas on l'y renvoie directement sans écran intermédiaire.
	 */
	private function redirect_after_auth( $notice = '' ) {
		$target = ! empty( $_POST['ip_redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['ip_redirect_to'] ) ) : '';

		if ( $target ) {
			wp_safe_redirect( $target );
			exit;
		}

		$redirect = $this->get_return_url();

		if ( $notice ) {
			$redirect = add_query_arg( 'ip_notice', $notice, $redirect );
		}

		wp_safe_redirect( $redirect ?: home_url( '/' ) );
		exit;
	}

	/**
	 * URL de la page du formulaire vers laquelle revenir après traitement.
	 * Le formulaire se soumettant sur lui-même, son Referer HTTP est
	 * identique à l'URL de la requête POST : wp_get_referer() considère ça
	 * comme une boucle et renvoie false. On passe donc l'URL de la page via
	 * un champ caché (ip_auth_page), avec wp_get_referer() en secours si le
	 * champ est absent (appel direct, ancien cache de page...).
	 */
	private function get_return_url() {
		if ( ! empty( $_POST['ip_auth_page'] ) ) {
			$url = esc_url_raw( wp_unslash( $_POST['ip_auth_page'] ) );

			if ( $url ) {
				return $url;
			}
		}

		return wp_get_referer() ?: home_url( '/' );
	}

	private function redirect_with_error( $code, $panel = '', $fields = array() ) {
		$redirect = add_query_arg( 'ip_error', $code, $this->get_return_url() );

		if ( $panel ) {
			$redirect = add_query_arg( 'ip_panel', $panel, $redirect );
		}

		foreach ( $fields as $key => $value ) {
			$redirect = add_query_arg( $key, rawurlencode( $value ), $redirect );
		}

		wp_safe_redirect( $redirect );
		exit;
	}

	public function render_auth_shortcode( $atts ) {
		$notice = isset( $_GET['ip_notice'] ) ? sanitize_key( wp_unslash( $_GET['ip_notice'] ) ) : '';

		if ( is_user_logged_in() ) {
			if ( in_array( $notice, array( 'login_success', 'register_success' ), true ) ) {
				return $this->render_auth_success( $notice );
			}

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

		$panel = isset( $_GET['ip_panel'] ) ? sanitize_key( wp_unslash( $_GET['ip_panel'] ) ) : 'login';
		if ( ! in_array( $panel, array( 'login', 'register', 'lost_password' ), true ) ) {
			$panel = 'login';
		}

		$prefill_email = isset( $_GET['ip_email'] ) ? sanitize_email( wp_unslash( $_GET['ip_email'] ) ) : '';
		$prefill_name  = isset( $_GET['ip_name'] ) ? sanitize_text_field( wp_unslash( $_GET['ip_name'] ) ) : '';
		$prefill_login = isset( $_GET['ip_login'] ) ? sanitize_text_field( wp_unslash( $_GET['ip_login'] ) ) : '';

		$current_url = remove_query_arg( array( 'ip_error', 'ip_panel', 'ip_notice', 'ip_email', 'ip_name', 'ip_login' ) );

		ob_start();
		include IP_PATH . 'templates/auth-form.php';

		return ob_get_clean();
	}

	private function render_auth_success( $notice ) {
		wp_enqueue_style( 'ip-tunnel' );

		$messages = array(
			'login_success'    => __( 'Connexion réussie.', 'inscription-premium' ),
			'register_success' => __( 'Inscription prise en compte.', 'inscription-premium' ),
		);

		$profile_url = self::get_login_url();
		$tunnel_url  = IP_Tunnel::get_tunnel_page_url();

		ob_start();
		include IP_PATH . 'templates/auth-success.php';

		return ob_get_clean();
	}
}
