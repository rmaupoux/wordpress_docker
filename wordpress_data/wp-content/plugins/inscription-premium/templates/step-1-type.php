<?php
/**
 * Étape 1 — Type de bien.
 * Les cartes sont générées dynamiquement depuis la taxonomie IP_BOAT_TAXONOMY
 * (choix validé : pas de liste figée, pour rester synchronisé avec l'admin Pods).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$terms = get_terms( array(
	'taxonomy'   => IP_BOAT_TAXONOMY,
	'hide_empty' => false,
	'orderby'    => 'name',
	'order'      => 'ASC',
) );

$selected_term = (int) ( $draft['type'] ?? 0 );
?>
<section class="ip-tunnel-step ip-step-type" data-ip-step="1">
	<h2 class="ip-step-title"><?php esc_html_e( 'Quel type de bien souhaitez-vous publier ?', 'inscription-premium' ); ?></h2>

	<?php if ( is_wp_error( $terms ) || empty( $terms ) ) : ?>
		<p><?php esc_html_e( 'Aucun type de bateau n\'est configuré pour le moment.', 'inscription-premium' ); ?></p>
	<?php else : ?>
		<div class="ip-type-cards">
			<?php foreach ( $terms as $term ) : ?>
				<button type="button"
					class="ip-type-card <?php echo $selected_term === $term->term_id ? 'is-selected' : ''; ?>"
					data-term-id="<?php echo esc_attr( $term->term_id ); ?>">
					<span class="ip-type-card-icon" aria-hidden="true">
						<svg viewBox="0 0 64 64" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M8 40h48l-6 14H14z" />
							<path d="M32 6v28M32 6l14 10-14 8" />
						</svg>
					</span>
					<span class="ip-type-card-label"><?php echo esc_html( $term->name ); ?></span>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class="ip-step-actions">
		<button type="button" class="ip-btn ip-btn-primary" id="ip-step1-next" disabled>
			<?php esc_html_e( 'Continue', 'inscription-premium' ); ?>
		</button>
	</div>
</section>
