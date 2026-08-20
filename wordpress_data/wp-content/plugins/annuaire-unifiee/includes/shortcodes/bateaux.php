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

					<!-- Search Model -->
					<div class="ab-input-group">
						<div class="ab-input-wrapper">
							<input
								type="text"
								id="ab-search-input"
								placeholder="Search model..."
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
					<div class="ab-filters-container">
						<div class="ab-filters-container-inner">
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

							<!-- Price -->
							<div class="ab-filter-box">
								<div class="ab-filter-header">
									<!-- <span class="ab-filter-label">Price</span> -->
									<!-- <button id="ab-price-reset" class="ab-reset-btn" type="button" title="Réinitialiser le prix">✕</button> -->
									<label class="ab-filter-label">Price</label>
											<!-- Currency -->
									<div class="ab-select-wrapper">
										<select id="ab-currency-select" class="ab-select-native">
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
											<option value="GBP">GBP</option>
											<option value="CHF">CHF</option>
											<option value="AED">AED</option>
										</select>
										<span class="ab-select-trigger ab-select-trigger--currency">USD</span>
										<ul class="ab-select-options" id="ab-currency-options"></ul>
									</div>
								</div>
							
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
		</div>

		
		</div>

		<!-- Featured Slider -->
		<div class="ab-featured-section">
			<h2 class="ab-featured-title">FEATURED YACHTS</h2>
			<div class="ab-featured-slider-wrapper">
				<button id="ab-featured-prev" class="ab-featured-nav ab-featured-prev" type="button" aria-label="Précédent">‹</button>
				<div class="ab-featured-slider" id="ab-featured-slider"></div>
				<button id="ab-featured-next" class="ab-featured-nav ab-featured-next" type="button" aria-label="Suivant">›</button>
			</div>
			<div class="ab-featured-dots" id="ab-featured-dots"></div>
		</div>
		

		<!-- Results Section -->
		<div class="ab-results-section" id="ab-results-section" hidden>
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

/* -------------------------------------------------------------------------
 * SHORTCODE : [annuaire_bateaux_par_type] — grille de bateaux du type
 * consulté, à placer sur le template FSE d'archive de la taxonomie
 * "type_de_bateau" (mêmes markup/classes que la grille de résultats de la
 * page d'accueil : #ab-results-grid / .ab-yacht-card, voir plus haut et
 * js/script.js).
 * ---------------------------------------------------------------------- */

add_shortcode( 'annuaire_bateaux_par_type', function () {
	$terme = get_queried_object();

	if ( ! ( $terme instanceof WP_Term ) || AB_TAXONOMIE_TYPE !== $terme->taxonomy ) {
		return '';
	}

	$paged = max( 1, (int) ( get_query_var( 'paged' ) ?: get_query_var( 'page' ) ) );

	$query = new WP_Query( array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => 12,
		'paged'          => $paged,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => AB_TAXONOMIE_TYPE,
				'field'    => 'term_id',
				'terms'    => $terme->term_id,
			),
		),
	) );

	if ( ! $query->have_posts() ) {
		return sprintf(
			'<p class="ab-message">Aucun bateau disponible pour le type « %s » pour le moment.</p>',
			esc_html( $terme->name )
		);
	}

	$cards = '';

	foreach ( $query->posts as $post ) {
		$titre        = get_post_meta( $post->ID, 'model', true ) ?: $post->post_title;
		$prix         = intval( get_post_meta( $post->ID, 'asking_price', true ) );
		$localisation = get_post_meta( $post->ID, 'town', true ) ?: 'Location';
		$image_url    = get_the_post_thumbnail_url( $post->ID, 'medium_large' ) ?: get_the_post_thumbnail_url( $post->ID, 'full' );

		if ( ! $image_url ) {
			$image_url = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3C/svg%3E";
		}

		$cards .= sprintf(
			'<div class="ab-yacht-card">
				<div class="ab-yacht-image">
					<img src="%1$s" alt="%2$s">
				</div>
				<div class="ab-yacht-body">
					<h3 class="ab-yacht-title">%2$s</h3>
					<p class="ab-yacht-price" data-price-usd="%6$d">%3$s&nbsp;$</p>
					<div class="ab-yacht-location">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
						<span>%4$s</span>
					</div>
					<a href="%5$s" class="ab-yacht-btn">More Information</a>
				</div>
			</div>',
			esc_url( $image_url ),
			esc_html( $titre ),
			esc_html( number_format_i18n( $prix ) ),
			esc_html( $localisation ),
			esc_url( get_permalink( $post->ID ) ),
			$prix
		);
	}

	$liens_pagination = paginate_links( array(
		'total'     => $query->max_num_pages,
		'current'   => $paged,
		'prev_text' => 'Previous',
		'next_text' => 'Next',
		'type'      => 'array',
	) );

	$pagination = $liens_pagination
		? sprintf( '<div class="ab-pagination">%s</div>', implode( '', $liens_pagination ) )
		: '';

	return sprintf( '<div class="ab-results-grid">%s</div>%s', $cards, $pagination );
} );
