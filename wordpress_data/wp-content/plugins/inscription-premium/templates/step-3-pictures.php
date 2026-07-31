<?php
/**
 * Étape 3 — Pictures : au moins 3 photos (cover + n°2 + n°3), extensible.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$photo_ids = $draft['photo_ids'] ?? array();
$min_photos = 3;
?>
<section class="ip-tunnel-step ip-step-pictures" data-ip-step="3">
	<h2 class="ip-step-title"><?php esc_html_e( 'Photos de l\'annonce', 'inscription-premium' ); ?></h2>
	<p class="ip-step-subtitle"><?php esc_html_e( 'Au moins 3 photos sont nécessaires : Cover picture, picture n°2, picture n°3.', 'inscription-premium' ); ?></p>

	<div id="ip-photo-dropzone" class="ip-photo-dropzone" tabindex="0">
		<p><?php esc_html_e( 'Glissez-déposez vos photos ici, ou cliquez pour parcourir.', 'inscription-premium' ); ?></p>
		<input type="file" id="ip-photo-input" accept="image/jpeg,image/png,image/webp" multiple hidden />
	</div>

	<div id="ip-photo-grid" class="ip-photo-grid">
		<?php foreach ( $photo_ids as $index => $attachment_id ) : ?>
			<div class="ip-photo-item <?php echo 0 === $index ? 'is-cover' : ''; ?>" data-attachment-id="<?php echo esc_attr( $attachment_id ); ?>">
				<img src="<?php echo esc_url( wp_get_attachment_image_url( $attachment_id, 'thumbnail' ) ); ?>" alt="" />
				<button type="button" class="ip-photo-remove" aria-label="Remove">&times;</button>
			</div>
		<?php endforeach; ?>
	</div>

	<p class="ip-form-error" id="ip-step3-error" hidden></p>

	<div class="ip-step-actions">
		<button type="button" class="ip-btn ip-btn-primary" id="ip-step3-next" <?php disabled( count( $photo_ids ) < $min_photos ); ?>>
			<?php esc_html_e( 'Continue', 'inscription-premium' ); ?>
		</button>
	</div>
</section>
