<?php
/**
 * Écran affiché après une connexion ou une inscription réussie.
 * Variables disponibles : $notice, $messages, $profile_url, $tunnel_url.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="ip-auth-wrapper ip-auth-success">
	<div class="ip-notice ip-notice-success"><?php echo esc_html( $messages[ $notice ] ); ?></div>

	<div class="ip-auth-success-actions">
		<a class="ip-btn ip-btn-primary" href="<?php echo esc_url( $profile_url ); ?>">
			<?php esc_html_e( 'Accéder à mon profil', 'inscription-premium' ); ?>
		</a>
		<a class="ip-btn ip-btn-secondary" href="<?php echo esc_url( $tunnel_url ); ?>">
			<?php esc_html_e( 'Créer une fiche bateau', 'inscription-premium' ); ?>
		</a>
	</div>
</div>
