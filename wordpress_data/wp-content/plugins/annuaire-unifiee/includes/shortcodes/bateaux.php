<?php
/**
 * Shortcode [annuaire_bateaux_recherche] et auto-linking des bateaux à leur type
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * AUTO-LINKING: Lier automatiquement les bateaux aux types de bateau
 * ---------------------------------------------------------------------- */

add_action( 'save_post_annuaire_bateau', function ( $post_id ) {
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	$post = get_post( $post_id );
	$model = get_post_meta( $post_id, 'model', true ) . ' ' . $post->post_title;
	$model_lower = strtolower( $model );

	$type_mapping = array(
		'catamaran'  => 'catamaran',
		'motor'      => 'motor-yacht',
		'sailing'    => 'sailing_yacht',
		'house boat' => 'house-boat',
	);

	foreach ( $type_mapping as $keyword => $slug ) {
		if ( strpos( $model_lower, strtolower( $keyword ) ) !== false ) {
			wp_set_post_terms( $post_id, $slug, AB_TAXONOMIE_TYPE, false );
			break;
		}
	}
} );

/* -------------------------------------------------------------------------
 * SHORTCODE : [annuaire_bateaux_recherche]
 * ---------------------------------------------------------------------- */

add_shortcode( 'annuaire_bateaux_recherche', function () {
	ob_start();
	?>
	<div class="ab-recherche" id="ab-root">

		<!-- Search Section -->
		<div class="ab-search-section">
			<div class="ab-search-container">
				<div class="ab-search-inputs">

					<!-- Search Builder -->
					<div class="ab-input-group">
						<div class="ab-input-wrapper">
							<input
								type="text"
								id="ab-search-input"
								placeholder="Search builder..."
								class="ab-input"
								autocomplete="off"
							>
							<svg class="ab-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>

						<!-- Select Type with Reset Button -->
						<div style="display: flex; gap: 0.5rem; align-items: flex-start;">
							<div class="ab-select-wrapper" style="flex: 1;">
								<select id="ab-type-select" class="ab-select-native">
									<option value="">Select type</option>
								</select>
								<span class="ab-select-trigger">Select type</span>
								<ul class="ab-select-options" id="ab-type-options"></ul>
							</div>
							<button id="ab-reset-filter" class="ab-reset-btn" type="button" title="Réinitialiser les filtres">✕</button>
						</div>
					</div>

					<!-- Length and Unit -->
					<div class="ab-filter-box">
						<label class="ab-filter-label">Length and Unit</label>
						<div class="ab-filter-grid">
							<!-- Unit Selector -->
							<div class="ab-select-wrapper">
								<select id="ab-unit-select" class="ab-select-native">
									<option value="FT">FT</option>
									<option value="M">M</option>
								</select>
								<span class="ab-select-trigger">FT</span>
								<ul class="ab-select-options" id="ab-unit-options"></ul>
							</div>

							<!-- Length Min -->
							<div class="ab-select-wrapper">
								<select id="ab-length-min-select" class="ab-select-native">
									<option value="">Min</option>
									<option value="0">0</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="40">40</option>
									<option value="50">50</option>
									<option value="60">60</option>
									<option value="70">70</option>
									<option value="80">80</option>
									<option value="90">90</option>
									<option value="100">100</option>
								</select>
								<span class="ab-select-trigger ab-no-arrow">Min</span>
								<ul class="ab-select-options" id="ab-length-min-options"></ul>
							</div>

							<!-- Length Max -->
							<div class="ab-select-wrapper">
								<select id="ab-length-max-select" class="ab-select-native">
									<option value="">Max</option>
									<option value="0">0</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="40">40</option>
									<option value="50">50</option>
									<option value="60">60</option>
									<option value="70">70</option>
									<option value="80">80</option>
									<option value="90">90</option>
									<option value="100">100</option>
								</select>
								<span class="ab-select-trigger ab-no-arrow">Max</span>
								<ul class="ab-select-options" id="ab-length-max-options"></ul>
							</div>
						</div>
					</div>

					<!-- Year -->
					<div class="ab-filter-box">
						<label class="ab-filter-label">Year</label>
						<div class="ab-number-group">
							<div class="ab-number-input">
								<input type="number" id="ab-year-min" placeholder="Min" min="1970" max="2100">
								<div class="ab-spinners">
									<button class="ab-spinner-btn" data-action="increment"></button>
									<button class="ab-spinner-btn" data-action="decrement"></button>
								</div>
							</div>
							<div class="ab-number-input">
								<input type="number" id="ab-year-max" placeholder="Max" min="1970" max="2100">
								<div class="ab-spinners">
									<button class="ab-spinner-btn" data-action="increment"></button>
									<button class="ab-spinner-btn" data-action="decrement"></button>
								</div>
							</div>
						</div>
					</div>

					<!-- Price USD -->
					<div class="ab-filter-box">
						<label class="ab-filter-label">Price USD</label>
						<div class="ab-number-group">
							<div class="ab-number-input">
								<input type="number" id="ab-price-min" placeholder="Min" min="0" max="100000000">
								<div class="ab-spinners">
									<button class="ab-spinner-btn" data-action="increment"></button>
									<button class="ab-spinner-btn" data-action="decrement"></button>
								</div>
							</div>
							<div class="ab-number-input">
								<input type="number" id="ab-price-max" placeholder="Max" min="0" max="100000000">
								<div class="ab-spinners">
									<button class="ab-spinner-btn" data-action="increment"></button>
									<button class="ab-spinner-btn" data-action="decrement"></button>
								</div>
							</div>
						</div>
					</div>

				</div>

				<!-- Search Button -->
				<div class="ab-button-container">
					<button id="ab-search-btn" class="ab-search-btn">SEARCH YACHT</button>
				</div>
			</div>
		</div>

		<!-- Results Section -->
		<div class="ab-results-section">
			<div class="ab-results-header">
				<h2 class="ab-results-title">YACHTS FOR SALE</h2>
				<div class="ab-select-wrapper" style="min-width: 180px;">
					<select id="ab-sort-select" class="ab-select-native">
						<option value="">Sort by</option>
						<option value="price_low_high">Price (low to high)</option>
						<option value="price_high_low">Price (high to low)</option>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
					<span class="ab-select-trigger">Sort by</span>
					<ul class="ab-select-options" id="ab-sort-options"></ul>
				</div>
			</div>

			<div id="ab-message" class="ab-message" hidden></div>
			<div id="ab-results-grid" class="ab-results-grid"></div>

			<!-- Pagination -->
			<div id="ab-pagination" class="ab-pagination" hidden></div>
		</div>

	</div>
	<?php
	return ob_get_clean();
} );
