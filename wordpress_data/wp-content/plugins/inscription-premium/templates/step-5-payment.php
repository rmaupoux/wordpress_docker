<?php
/**
 * Étape 5 — Payment : récap total + paiement (Stripe Checkout).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( empty( $draft['listing_id'] ) || empty( $draft['duration_days'] ) ) {
	echo '<p class="ip-form-error">' . esc_html__( 'Merci de terminer d\'abord les étapes précédentes.', 'inscription-premium' ) . '</p>';
	return;
}

$total   = IP_Payment::calculate_total( $draft );
$summary = IP_Pods_Bridge::get_listing_summary( (int) $draft['listing_id'] );
$stripe_ready = IP_Payment::is_configured();
?>
<section class="ip-tunnel-step ip-step-payment" data-ip-step="5">
	<h2 class="ip-step-title"><?php esc_html_e( 'Paiement', 'inscription-premium' ); ?></h2>

	<div class="ip-payment-summary">
		<p><strong><?php echo esc_html( $summary['title'] ); ?></strong></p>
		<p><?php printf( esc_html__( 'Durée de publication : %d jours', 'inscription-premium' ), (int) $draft['duration_days'] ); ?></p>
		<?php if ( ! empty( $draft['addons']['highlights'] ) ) : ?>
			<p><?php esc_html_e( 'Option Highlights incluse', 'inscription-premium' ); ?></p>
		<?php endif; ?>
		<p class="ip-payment-total"><?php printf( esc_html__( 'Total : %s', 'inscription-premium' ), esc_html( ip_format_price( $total ) ) ); ?></p>
	</div>

	<?php if ( $total <= 0 ) : ?>
		<p class="ip-form-error" id="ip-step5-error" hidden></p>
		<div class="ip-step-actions">
			<button type="button" class="ip-btn ip-btn-primary" id="ip-step5-pay">
				<?php esc_html_e( 'Publier l\'annonce (gratuit)', 'inscription-premium' ); ?>
			</button>
		</div>
	<?php elseif ( ! $stripe_ready ) : ?>
		<p class="ip-form-error"><?php esc_html_e( 'Le paiement n\'est pas encore configuré (clé Stripe manquante côté admin).', 'inscription-premium' ); ?></p>
	<?php else : ?>
		<p class="ip-form-error" id="ip-step5-error" hidden></p>
		<div class="ip-step-actions">
			<button type="button" class="ip-btn ip-btn-primary" id="ip-step5-pay">
				<?php printf( esc_html__( 'Payer %s', 'inscription-premium' ), esc_html( ip_format_price( $total ) ) ); ?>
			</button>
		</div>
	<?php endif; ?>
</section>
