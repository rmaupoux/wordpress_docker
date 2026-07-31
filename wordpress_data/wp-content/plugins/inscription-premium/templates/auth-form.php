<?php
/**
 * Formulaire d'inscription / connexion / mot de passe oublié.
 * Variables disponibles : $redirect_to, $error, $notice.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

wp_enqueue_style( 'ip-tunnel' );

$error_messages = array(
	'invalid_nonce'       => __( 'Session expirée, merci de réessayer.', 'inscription-premium' ),
	'invalid_fields'      => __( 'Merci de renseigner un email valide, un nom et un mot de passe d\'au moins 8 caractères.', 'inscription-premium' ),
	'email_exists'        => __( 'Un compte existe déjà avec cet email.', 'inscription-premium' ),
	'registration_failed' => __( 'L\'inscription a échoué, merci de réessayer.', 'inscription-premium' ),
	'login_failed'        => __( 'Identifiants incorrects.', 'inscription-premium' ),
);
?>
<div class="ip-auth-wrapper">
	<?php if ( $error && isset( $error_messages[ $error ] ) ) : ?>
		<div class="ip-notice ip-notice-error"><?php echo esc_html( $error_messages[ $error ] ); ?></div>
	<?php endif; ?>

	<?php if ( 'lost_password_sent' === $notice ) : ?>
		<div class="ip-notice ip-notice-success">
			<?php esc_html_e( 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.', 'inscription-premium' ); ?>
		</div>
	<?php endif; ?>

	<div class="ip-auth-tabs">
		<button type="button" class="ip-auth-tab active" data-ip-tab="login"><?php esc_html_e( 'Connexion', 'inscription-premium' ); ?></button>
		<button type="button" class="ip-auth-tab" data-ip-tab="register"><?php esc_html_e( 'Inscription', 'inscription-premium' ); ?></button>
		<button type="button" class="ip-auth-tab" data-ip-tab="lost_password"><?php esc_html_e( 'Mot de passe oublié', 'inscription-premium' ); ?></button>
	</div>

	<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="login">
		<input type="hidden" name="ip_auth_action" value="login" />
		<input type="hidden" name="ip_redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
		<?php wp_nonce_field( 'ip_auth_login', 'ip_auth_nonce' ); ?>

		<label>
			<?php esc_html_e( 'Email ou identifiant', 'inscription-premium' ); ?>
			<input type="text" name="ip_login" required />
		</label>
		<label>
			<?php esc_html_e( 'Mot de passe', 'inscription-premium' ); ?>
			<input type="password" name="ip_password" required />
		</label>
		<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Se connecter', 'inscription-premium' ); ?></button>
	</form>

	<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="register" hidden>
		<input type="hidden" name="ip_auth_action" value="register" />
		<input type="hidden" name="ip_redirect_to" value="<?php echo esc_attr( $redirect_to ); ?>" />
		<?php wp_nonce_field( 'ip_auth_register', 'ip_auth_nonce' ); ?>

		<label>
			<?php esc_html_e( 'Nom complet', 'inscription-premium' ); ?>
			<input type="text" name="ip_name" required />
		</label>
		<label>
			<?php esc_html_e( 'Email', 'inscription-premium' ); ?>
			<input type="email" name="ip_email" required />
		</label>
		<label>
			<?php esc_html_e( 'Mot de passe (8 caractères min.)', 'inscription-premium' ); ?>
			<input type="password" name="ip_password" minlength="8" required />
		</label>
		<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Créer mon compte', 'inscription-premium' ); ?></button>
	</form>

	<form method="post" class="ip-auth-form ip-auth-panel" data-ip-panel="lost_password" hidden>
		<input type="hidden" name="ip_auth_action" value="lost_password" />
		<?php wp_nonce_field( 'ip_auth_lost_password', 'ip_auth_nonce' ); ?>

		<label>
			<?php esc_html_e( 'Email', 'inscription-premium' ); ?>
			<input type="email" name="ip_email" required />
		</label>
		<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Recevoir un lien de réinitialisation', 'inscription-premium' ); ?></button>
	</form>
</div>
