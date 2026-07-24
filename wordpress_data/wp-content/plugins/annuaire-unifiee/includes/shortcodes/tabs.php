<?php
/**
 * Shortcode [annuaire_tabs] - Affiche les onglets YACHT / CHARTER / NETWORK
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_shortcode( 'annuaire_tabs', function () {
	ob_start();
	?>
	<div class="ab-tabs-container">
		<!-- Tabs Navigation -->
		<div class="ab-tabs-nav">
			<button class="ab-tab-btn ab-tab-active" data-tab="yacht">YACHT</button>
			<button class="ab-tab-btn" data-tab="charter">CHARTER</button>
			<button class="ab-tab-btn" data-tab="network">NETWORK</button>
		</div>

		<!-- Tabs Content -->
		<div class="ab-tabs-content">
			<!-- YACHT Tab -->
			<div class="ab-tab-pane ab-tab-active" id="ab-tab-yacht">
				<?php echo do_shortcode( '[annuaire_bateaux_recherche]' ); ?>
			</div>

			<!-- CHARTER Tab -->
			<div class="ab-tab-pane" id="ab-tab-charter">
				<?php echo do_shortcode( '[annuaire_recherche]' ); ?>
			</div>

			<!-- NETWORK Tab -->
			<div class="ab-tab-pane" id="ab-tab-network">
				<div class="ab-network-placeholder">
					<p>Contenu en attente</p>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
} );
