<?php
/**
 * Étape 4 — Period of validity : récap annonce + durée de publication + options.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( empty( $draft['listing_id'] ) ) {
	echo '<p class="ip-form-error">' . esc_html__( 'Merci de terminer d\'abord l\'étape photos.', 'inscription-premium' ) . '</p>';
	return;
}

$summary   = IP_Pods_Bridge::get_listing_summary( (int) $draft['listing_id'] );
$durations = IP_Payment::get_duration_options();
$highlights_price = (float) get_option( 'ip_highlights_price', 15 );
$selected_duration = (int) ( $draft['duration_days'] ?? 0 );
$has_highlights = ! empty( $draft['addons']['highlights'] );
?>
<section class="ip-tunnel-step ip-step-validity" data-ip-step="4">

	<div class="ip-listing-summary">
		<?php if ( $summary['cover_url'] ) : ?>
			<img src="<?php echo esc_url( $summary['cover_url'] ); ?>" alt="" class="ip-listing-summary-photo" />
		<?php endif; ?>
		<div class="ip-listing-summary-info">
			<h3><?php echo esc_html( $summary['title'] ); ?></h3>
			<p class="ip-listing-summary-price"><?php echo esc_html( ip_format_price( $summary['price'] ) ); ?></p>
			<p class="ip-listing-summary-location"><?php echo esc_html( $summary['localisation'] ); ?></p>
		</div>
	</div>

	<h2 class="ip-step-title"><?php esc_html_e( 'Durée de publication', 'inscription-premium' ); ?></h2>

	<div class="ip-duration-cards" role="radiogroup">
		<?php foreach ( $durations as $days => $option ) : ?>
			<label class="ip-duration-card <?php echo ! empty( $option['recommended'] ) ? 'is-recommended' : ''; ?>">
				<?php if ( ! empty( $option['recommended'] ) ) : ?>
					<span class="ip-badge ip-badge-recommended"><?php esc_html_e( 'Recommandé', 'inscription-premium' ); ?></span>
				<?php endif; ?>
				<input type="radio" name="duration_days" value="<?php echo esc_attr( $days ); ?>" <?php checked( $selected_duration, $days ); ?> required />
				<span class="ip-duration-days"><?php printf( esc_html__( '%d jours', 'inscription-premium' ), (int) $days ); ?></span>
				<span class="ip-duration-price"><?php echo esc_html( ip_format_price( $option['price'] ) ); ?></span>
			</label>
		<?php endforeach; ?>
	</div>

	<label class="ip-addon-checkbox">
		<input type="checkbox" name="addon_highlights" value="1" <?php checked( $has_highlights ); ?> />
		<?php printf( esc_html__( 'Mettre en avant l\'annonce (Highlights) — +%s', 'inscription-premium' ), esc_html( ip_format_price( $highlights_price ) ) ); ?>
	</label>

	<p class="ip-form-error" id="ip-step4-error" hidden></p>

	<div class="ip-step-actions">
		<button type="button" class="ip-btn ip-btn-primary" id="ip-step4-next">
			<?php esc_html_e( 'Continue to payment', 'inscription-premium' ); ?>
		</button>
	</div>
</section>
