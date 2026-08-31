<?php
/**
 * Formulaire d'inscription / connexion / mot de passe oublié.
 * Variables disponibles : $redirect_to, $error, $notice, $panel,
 * $prefill_email, $prefill_name, $prefill_login, $current_url.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

wp_enqueue_style( 'ip-tunnel' );

$error_messages = array(
	'invalid_nonce'       => __( 'Your session has expired, please try again.', 'inscription-premium' ),
	'invalid_fields'      => __( 'Please enter a valid email, a name and a password of at least 8 characters.', 'inscription-premium' ),
	'email_exists'        => __( 'An account already exists with this email.', 'inscription-premium' ),
	'registration_failed' => __( 'Registration failed, please try again.', 'inscription-premium' ),
	'login_failed'        => __( 'Incorrect credentials.', 'inscription-premium' ),
);
?>
<div class="ip-login-split">
	<div class="ip-login-visual" style="background-image:url('<?php echo esc_url( IP_URL . 'assets/img/yacht-login.jpg' ); ?>');"></div>

	<div class="ip-login-panel">
		<div class="ip-auth-wrapper">
			<?php if ( $error && isset( $error_messages[ $error ] ) ) : ?>
				<div class="ip-notice ip-notice-error"><?php echo esc_html( $error_messages[ $error ] ); ?></div>
			<?php endif; ?>

			<?php if ( 'lost_password_sent' === $notice ) : ?>
				<div class="ip-notice ip-notice-success">
					<?php esc_html_e( 'If an account exists with this email, a reset link has just been sent.', 'inscription-premium' ); ?>
				</div>
			<?php endif; ?>

			<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="login" <?php echo ( 'login' === $panel ) ? '' : 'hidden'; ?>>
				<h1 class="ip-auth-heading"><?php esc_html_e( 'Log In', 'inscription-premium' ); ?></h1>

				<input type="hidden" name="ip_auth_action" value="login" />
				<input type="hidden" name="ip_redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
				<input type="hidden" name="ip_auth_page" value="<?php echo esc_attr( $current_url ); ?>" />
				<?php wp_nonce_field( 'ip_auth_login', 'ip_auth_nonce' ); ?>

				<label class="ip-visually-hidden" for="ip-login">
					<?php esc_html_e( 'Email or username', 'inscription-premium' ); ?>
				</label>
				<input type="text" id="ip-login" name="ip_login" value="<?php echo esc_attr( $prefill_login ); ?>" placeholder="<?php esc_attr_e( 'Email', 'inscription-premium' ); ?>" required />

				<label class="ip-visually-hidden" for="ip-password">
					<?php esc_html_e( 'Password', 'inscription-premium' ); ?>
				</label>
				<input type="password" id="ip-password" name="ip_password" placeholder="<?php esc_attr_e( 'Password', 'inscription-premium' ); ?>" required />

				<button type="button" class="ip-auth-tab ip-lost-password-link" data-ip-tab="lost_password"><?php esc_html_e( 'Forgot your password?', 'inscription-premium' ); ?></button>
				<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Log in', 'inscription-premium' ); ?></button>

				<button type="button" class="ip-auth-tab ip-auth-switch" data-ip-tab="register"><?php esc_html_e( 'Not registered yet', 'inscription-premium' ); ?></button>
			</form>

			<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="register" <?php echo ( 'register' === $panel ) ? '' : 'hidden'; ?>>
				<h1 class="ip-auth-heading"><?php esc_html_e( 'Sign Up', 'inscription-premium' ); ?></h1>

				<input type="hidden" name="ip_auth_action" value="register" />
				<input type="hidden" name="ip_redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
				<input type="hidden" name="ip_auth_page" value="<?php echo esc_attr( $current_url ); ?>" />
				<?php wp_nonce_field( 'ip_auth_register', 'ip_auth_nonce' ); ?>

				<label class="ip-visually-hidden" for="ip-name">
					<?php esc_html_e( 'Full name', 'inscription-premium' ); ?>
				</label>
				<input type="text" id="ip-name" name="ip_name" value="<?php echo esc_attr( $prefill_name ); ?>" placeholder="<?php esc_attr_e( 'Full name', 'inscription-premium' ); ?>" required />

				<label class="ip-visually-hidden" for="ip-email">
					<?php esc_html_e( 'Email', 'inscription-premium' ); ?>
				</label>
				<input type="email" id="ip-email" name="ip_email" value="<?php echo esc_attr( $prefill_email ); ?>" placeholder="<?php esc_attr_e( 'Email', 'inscription-premium' ); ?>" required />

				<label class="ip-visually-hidden" for="ip-register-password">
					<?php esc_html_e( 'Password (min. 8 characters)', 'inscription-premium' ); ?>
				</label>
				<input type="password" id="ip-register-password" name="ip_password" minlength="8" placeholder="<?php esc_attr_e( 'Password (min. 8 characters)', 'inscription-premium' ); ?>" required />

				<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Create my account', 'inscription-premium' ); ?></button>

				<button type="button" class="ip-auth-tab ip-auth-switch" data-ip-tab="login"><?php esc_html_e( 'Already have an account? Log in', 'inscription-premium' ); ?></button>
			</form>

			<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="lost_password" <?php echo ( 'lost_password' === $panel ) ? '' : 'hidden'; ?>>
				<h1 class="ip-auth-heading"><?php esc_html_e( 'Forgot your password?', 'inscription-premium' ); ?></h1>

				<input type="hidden" name="ip_auth_action" value="lost_password" />
				<input type="hidden" name="ip_auth_page" value="<?php echo esc_attr( $current_url ); ?>" />
				<?php wp_nonce_field( 'ip_auth_lost_password', 'ip_auth_nonce' ); ?>

				<label class="ip-visually-hidden" for="ip-lost-email">
					<?php esc_html_e( 'Email', 'inscription-premium' ); ?>
				</label>
				<input type="email" id="ip-lost-email" name="ip_email" placeholder="<?php esc_attr_e( 'Email', 'inscription-premium' ); ?>" required />

				<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Send reset link', 'inscription-premium' ); ?></button>

				<button type="button" class="ip-auth-tab ip-auth-switch" data-ip-tab="login"><?php esc_html_e( 'Back to log in', 'inscription-premium' ); ?></button>
			</form>
		</div>
	</div>
</div>
