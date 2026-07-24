<?php
/**
 * Plugin Name: Annuaire Bateaux – Recherche instantanée
 * Description: Shortcode [annuaire_bateaux_recherche] : recherche instantanée sur contact_assoc (dès 3 caractères), filtre par type de bateau (taxonomie), et filtres Length, Year, Price USD appliqués au clic sur Search Yacht. Utilise GraphQL pour les requêtes.
 * Version: 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AB_CPT_NAME', 'annuaire_bateau' );
define( 'AB_TAXONOMIE_TYPE', 'type_de_bateau' );

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
 * 1. ENDPOINTS GraphQL (personnalisés si nécessaire)
 * ---------------------------------------------------------------------- */

add_action( 'graphql_register_types', function () {
	// Les types GraphQL sont automatiquement générés par WP-GraphQL
	// pour le CPT annuaire_bateau et la taxonomie type_de_bateau
} );

/* -------------------------------------------------------------------------
 * 2. ENDPOINTS REST (pour les requêtes non-GraphQL, optionnel)
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', function () {

	/* Recherche de contacts : /wp-json/annuaire-bateau/v1/recherche?terme=xxx */
	register_rest_route( 'annuaire-bateau/v1', '/recherche', array(
		'methods'             => 'GET',
		'callback'            => 'ab_recherche_contacts',
		'permission_callback' => '__return_true',
		'args'                => array(
			'terme' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => function ( $value ) {
					return mb_strlen( trim( $value ) ) >= 3;
				},
			),
		),
	) );

	/* Bateaux d'un contact : /wp-json/annuaire-bateau/v1/par-contact?contact_id=xxx */
	register_rest_route( 'annuaire-bateau/v1', '/par-contact', array(
		'methods'             => 'GET',
		'callback'            => 'ab_bateaux_par_contact',
		'permission_callback' => '__return_true',
		'args'                => array(
			'contact_id' => array(
				'required'          => true,
				'sanitize_callback' => function( $value ) { return intval( $value ); },
			),
		),
	) );

	/* Types de bateau : /wp-json/annuaire-bateau/v1/types */
	register_rest_route( 'annuaire-bateau/v1', '/types', array(
		'methods'             => 'GET',
		'callback'            => 'ab_get_types',
		'permission_callback' => '__return_true',
	) );

	/* Bateaux avec filtres et pagination : /wp-json/annuaire-bateau/v1/filtrer */
	register_rest_route( 'annuaire-bateau/v1', '/filtrer', array(
		'methods'             => 'GET',
		'callback'            => 'ab_filtrer_bateaux',
		'permission_callback' => '__return_true',
		'args'                => array(
			'contact'    => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'type'       => array( 'sanitize_callback' => 'sanitize_title' ),
			'length_min' => array( 'sanitize_callback' => function( $v ) { return floatval( $v ); } ),
			'length_max' => array( 'sanitize_callback' => function( $v ) { return floatval( $v ); } ),
			'year_min'   => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'year_max'   => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'price_min'  => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'price_max'  => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'page'       => array( 'sanitize_callback' => function( $v ) { return max( 1, intval( $v ) ); }, 'default' => 1 ),
		),
	) );

	/* Lier tous les bateaux à leur type : /wp-json/annuaire-bateau/v1/link-boats-to-types */
	register_rest_route( 'annuaire-bateau/v1', '/link-boats-to-types', array(
		'methods'             => 'POST',
		'callback'            => 'ab_link_boats_to_types',
		'permission_callback' => '__return_true',
	) );
} );

/**
 * Recherche les contacts qui ont des bateaux (3+ caractères)
 */
function ab_recherche_contacts( WP_REST_Request $request ) {
	global $wpdb;
	$terme = trim( $request->get_param( 'terme' ) );

	// Récupérer tous les bateaux qui ont ce contact associé
	$query = new WP_Query( array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	) );

	$contact_ids = array();
	foreach ( $query->posts as $post_id ) {
		$contact_id = get_post_meta( $post_id, 'contact_assoc', true );
		if ( $contact_id && ! isset( $contact_ids[ $contact_id ] ) ) {
			$contact_ids[ $contact_id ] = true;
		}
	}

	if ( empty( $contact_ids ) ) {
		return rest_ensure_response( array() );
	}

	// Rechercher UNIQUEMENT dans le titre avec LIKE (pas de recherche full-text)
	$placeholders = implode( ',', array_fill( 0, count( $contact_ids ), '%d' ) );
	$like_term    = '%' . $wpdb->esc_like( $terme ) . '%';

	$results = $wpdb->get_results( $wpdb->prepare(
		"SELECT ID, post_title FROM {$wpdb->posts}
		 WHERE post_type = 'annuaire_maritime'
		 AND post_status = 'publish'
		 AND ID IN ($placeholders)
		 AND post_title LIKE %s
		 ORDER BY post_title ASC
		 LIMIT 10",
		array_merge( array_keys( $contact_ids ), array( $like_term ) )
	) );

	$resultats = array();
	foreach ( $results as $contact ) {
		$resultats[] = array(
			'id'    => $contact->ID,
			'nom'   => $contact->post_title,
			'email' => get_post_meta( $contact->ID, 'email', true ),
		);
	}

	return rest_ensure_response( $resultats );
}

/**
 * Retourne les bateaux associés à un contact
 */
function ab_bateaux_par_contact( WP_REST_Request $request ) {
	$contact_id = intval( $request->get_param( 'contact_id' ) );
	$page = max( 1, intval( $request->get_param( 'page' ) ?: 1 ) );
	$per_page = 12;

	$query = new WP_Query( array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => $per_page,
		'paged'          => $page,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			array(
				'key'   => 'contact_assoc',
				'value' => $contact_id,
			),
		),
	) );

	return rest_ensure_response( array(
		'bateaux'      => ab_formater_bateaux( $query->posts ),
		'pagination'   => array(
			'page'        => $page,
			'per_page'    => $per_page,
			'total'       => $query->found_posts,
			'total_pages' => $query->max_num_pages,
		),
		'filters'      => array( 'contact' => $contact_id ),
	) );
}

/**
 * Récupère les types de bateau (taxonomie)
 */
function ab_get_types() {
	$termes = get_terms( array(
		'taxonomy'   => AB_TAXONOMIE_TYPE,
		'hide_empty' => false,
		'orderby'    => 'name',
		'order'      => 'ASC',
	) );

	if ( is_wp_error( $termes ) ) {
		return rest_ensure_response( array() );
	}

	$types = array();
	foreach ( $termes as $terme ) {
		$types[] = array(
			'slug'  => $terme->slug,
			'label' => $terme->name,
			'count' => (int) $terme->count,
		);
	}

	return rest_ensure_response( $types );
}

/**
 * Lie tous les bateaux à leur type de bateau
 */
function ab_link_boats_to_types( WP_REST_Request $request ) {
	$query = new WP_Query( array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	) );

	$linked_count = 0;

	foreach ( $query->posts as $post_id ) {
		$model = strtolower( get_post_meta( $post_id, 'model', true ) . ' ' . get_post( $post_id )->post_title );
		$builder = strtolower( get_post_meta( $post_id, 'builder', true ) );

		// Mapping des mots-clés aux slugs de taxonomie
		$type_mapping = array(
			'catamaran'    => 'catamaran',
			'motor'        => 'motor-yacht',
			'sailing'      => 'sailing_yacht',
			'house boat'   => 'house-boat',
		);

		// Chercher le premier match et lier
		foreach ( $type_mapping as $keyword => $slug ) {
			if ( strpos( $model, $keyword ) !== false || strpos( $builder, $keyword ) !== false ) {
				wp_set_post_terms( $post_id, $slug, AB_TAXONOMIE_TYPE, false );
				$linked_count++;
				break;
			}
		}
	}

	return rest_ensure_response( array(
		'success' => true,
		'message' => "$linked_count bateaux ont été liés à leur type de bateau",
		'linked'  => $linked_count,
		'total'   => count( $query->posts ),
	) );
}

/**
 * Filtre les bateaux selon tous les critères avec pagination
 */
function ab_filtrer_bateaux( WP_REST_Request $request ) {
	$contact    = intval( $request->get_param( 'contact' ) ?: 0 );
	$type       = trim( $request->get_param( 'type' ) ?: '' );
	$length_min = floatval( $request->get_param( 'length_min' ) ?: 0 );
	$length_max = floatval( $request->get_param( 'length_max' ) ?: PHP_INT_MAX );
	$year_min   = intval( $request->get_param( 'year_min' ) ?: 0 );
	$year_max   = intval( $request->get_param( 'year_max' ) ?: 9999 );
	$price_min  = intval( $request->get_param( 'price_min' ) ?: 0 );
	$price_max  = intval( $request->get_param( 'price_max' ) ?: PHP_INT_MAX );
	$page       = max( 1, intval( $request->get_param( 'page' ) ?: 1 ) );
	$per_page   = 12;

	$args = array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => $per_page,
		'paged'          => $page,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array( 'relation' => 'AND' ),
	);

	// Filtre contact_assoc
	if ( ! empty( $contact ) ) {
		$args['meta_query'][] = array(
			'key'   => 'contact_assoc',
			'value' => $contact,
		);
	}

	// Filtres numériques
	if ( $length_min > 0 || $length_max < PHP_INT_MAX ) {
		$args['meta_query'][] = array(
			'key'     => 'lenght_ft',
			'value'   => array( $length_min, $length_max ),
			'compare' => 'BETWEEN',
			'type'    => 'DECIMAL',
		);
	}

	if ( $year_min > 0 || $year_max < 9999 ) {
		$args['meta_query'][] = array(
			'key'     => 'year',
			'value'   => array( $year_min, $year_max ),
			'compare' => 'BETWEEN',
			'type'    => 'NUMERIC',
		);
	}

	if ( $price_min > 0 || $price_max < PHP_INT_MAX ) {
		$args['meta_query'][] = array(
			'key'     => 'asking_price',
			'value'   => array( $price_min, $price_max ),
			'compare' => 'BETWEEN',
			'type'    => 'DECIMAL',
		);
	}

	// Filtre par type de bateau (taxonomie)
	if ( ! empty( $type ) ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => AB_TAXONOMIE_TYPE,
				'field'    => 'slug',
				'terms'    => $type,
			),
		);
	}

	$query = new WP_Query( $args );

	return rest_ensure_response( array(
		'bateaux'      => ab_formater_bateaux( $query->posts ),
		'pagination'   => array(
			'page'        => $page,
			'per_page'    => $per_page,
			'total'       => $query->found_posts,
			'total_pages' => $query->max_num_pages,
		),
		'filters'      => array(
			'contact'    => $contact,
			'type'       => $type,
			'length_min' => $length_min,
			'length_max' => $length_max,
			'year_min'   => $year_min,
			'year_max'   => $year_max,
			'price_min'  => $price_min,
			'price_max'  => $price_max,
		),
	) );
}

/**
 * Formate les bateaux pour la réponse REST/GraphQL
 */
function ab_formater_bateaux( $posts ) {
	$resultats = array();

	foreach ( $posts as $post ) {
		// Récupérer les métadonnées
		$contact_id = get_post_meta( $post->ID, 'contact_assoc', true );
		$contact_name = '';
		if ( $contact_id ) {
			$contact = get_post( $contact_id );
			$contact_name = $contact ? $contact->post_title : '';
		}

		// Récupérer l'image à la une
		$image_url = get_the_post_thumbnail_url( $post->ID, 'medium' );
		if ( ! $image_url ) {
			$image_url = get_the_post_thumbnail_url( $post->ID, 'full' );
		}

		$resultats[] = array(
			'id'            => $post->ID,
			'titre'         => $post->post_title,
			'model'         => get_post_meta( $post->ID, 'model', true ),
			'contact_assoc' => $contact_name,
			'longueur'      => (float) get_post_meta( $post->ID, 'lenght_ft', true ),
			'unite_longueur'=> 'FT',
			'annee'         => intval( get_post_meta( $post->ID, 'year', true ) ),
			'prix_usd'      => intval( get_post_meta( $post->ID, 'asking_price', true ) ),
			'localisation'  => get_post_meta( $post->ID, 'town', true ),
			'lien'          => get_permalink( $post->ID ),
			'image_url'     => $image_url,
		);
	}

	return $resultats;
}

/* -------------------------------------------------------------------------
 * 3. SHORTCODE : [annuaire_tabs] - Affiche les onglets
 * ---------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------
 * 4. SHORTCODE : [annuaire_bateaux_recherche]
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

/* -------------------------------------------------------------------------
 * 4. SCRIPT + STYLES
 * ---------------------------------------------------------------------- */

add_action( 'wp_footer', function () {
	global $post;
	if ( ! $post || ( ! has_shortcode( $post->post_content, 'annuaire_bateaux_recherche' ) && ! has_shortcode( $post->post_content, 'annuaire_tabs' ) ) ) {
		return;
	}
	?>
	<style>
		/* ===== TABS ===== */
		.ab-tabs-container {
			width: 100%;
		}

		.ab-tabs-nav {
			display: flex;
			justify-content: center;
			gap: 2rem;
			background: white;
			border-bottom: 1px solid #d1d5db;
			padding: 0 1rem;
		}

		.ab-tab-btn {
			padding: 1rem 0;
			border: none;
			background: none;
			cursor: pointer;
			font-weight: 600;
			color: #666;
			font-size: 0.95rem;
			border-bottom: 4px solid transparent;
			transition: all 0.2s;
		}

		.ab-tab-btn:hover {
			color: #162d55;
		}
		.ab-tab-btn:focus {
			border-color:transparent !important;
		 	border-width: 0px !important;
		}

		.ab-tab-btn.ab-tab-active {
			color: #111;
			border-bottom-color: #111;
		}

		.ab-tabs-content {
			min-width: 80%;
		}

		.ab-tab-pane {
			display: none;
			width: 100%;
			box-sizing: border-box;
		}

		.ab-tab-pane.ab-tab-active {
			display: block;
		}

		.ab-network-placeholder {
			width: 100%;
			box-sizing: border-box;
			padding: 3rem 1rem;
			text-align: center;
			color: #999;
			font-size: 1rem;
		}

		/* ===== MAIN LAYOUT ===== */
		.ab-recherche {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			padding: 2rem 1rem;
			background: #f9fafb;
		}

		.ab-search-section {
			background: white;
			padding: 2rem 1rem;
			border-radius: 0.375rem;
		}

		.ab-search-container {
			width: 100%;
		}

		.ab-search-inputs {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;
			margin-bottom: 2rem;
		}

		@media (min-width: 768px) {
			.ab-search-inputs {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			.ab-search-inputs {
				grid-template-columns: repeat(4, 1fr);
			}
		}

		/* ===== INPUTS ===== */
		.ab-input-group {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.ab-input-wrapper {
			position: relative;
		}

		.ab-input {
			width: 100%;
			padding: .5rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			font-size: 1rem;
			font-family: inherit;
			box-sizing: border-box;
		}

		.ab-input::placeholder {
			color: #162d55;
			font-size: 0.875rem;
		}

		.ab-input:focus {
			outline: none;
			ring-color: #162d55;
			border-color: #162d55;
		}

		.ab-search-icon {
			position: absolute;
			right: 0.75rem;
			top: 50%;
			transform: translateY(-50%);
			width: 1.25rem;
			height: 1.25rem;
			color: #9ca3af;
		}

		/* ===== CUSTOM SELECT ===== */
		.ab-select-wrapper {
			position: relative;
		}

		.ab-select-native {
			display: none;
		}

		.ab-select-trigger {
			display: block;
			padding: 0.5rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			background: white;
			cursor: pointer;
			user-select: none;
			padding-right: 1.75rem;
			color: #162d55;
			font-size: 0.875rem;
		}

		.ab-select-trigger::after {
			content: '›';
			position: absolute;
			right: 0.5rem;
			top: 50%;
			transform: translateY(-50%) rotate(90deg);
			font-size: 1.5rem;
			color: #162d55;
			line-height: 1;
			transition: transform 0.2s;
		}

		.ab-select-trigger.active::after {
			transform: translateY(-50%) rotate(-90deg);
		}

		.ab-select-trigger.ab-no-arrow::after {
			display: none;
		}

		.ab-select-options {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: white;
			border: 1px solid #d1d5db;
			border-top: none;
			border-radius: 0 0 0.375rem 0.375rem;
			max-height: 200px;
			overflow-y: auto;
			z-index: 10;
			display: none;
			list-style: none;
			margin: 0;
			padding: 0;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		.ab-select-options.open {
			display: block;
		}

		.ab-select-option {
			padding: 0.5rem;
			cursor: pointer;
			font-size: 0.875rem;
			border-bottom: 1px solid #eee;
		}

		.ab-select-option:hover {
			background: #f3f4f6;
		}

		.ab-select-option.selected {
			background: #162d55;
			color: white;
		}

		/* ===== FILTER BOXES ===== */
		.ab-filter-box {
			padding: .6rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			background: white;
		}

		.ab-filter-label {
			display: block;
			text-align: center;
			font-size: 0.875rem;
			font-weight: 600;
			margin-bottom: 0.75rem;
			color: #162d55;
		}

		.ab-filter-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
		}

		/* ===== NUMBER INPUTS ===== */
		.ab-number-group {
			display: flex;
			gap: 0.5rem;
		}

		.ab-number-input {
			position: relative;
			flex: 1;
			display: flex;
			align-items: stretch;
		}

		.ab-number-input input {
			flex: 1;
			padding: 0.5rem;
			padding-right: 1.75rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			font-size: 0.875rem;
			font-family: inherit;
		}

		.ab-number-input input::placeholder {
			color: #162d55;
			opacity: 0.7;
		}

		.ab-number-input input:focus {
			outline: none;
			border-color: #162d55;
		}

		.ab-number-input input[type="number"]::-webkit-outer-spin-button,
		.ab-number-input input[type="number"]::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		.ab-number-input input[type="number"] {
			-moz-appearance: textfield;
		}

		.ab-spinners {
			position: absolute;
			right: 0.25rem;
			top: 0;
			bottom: 0;
			display: flex;
			flex-direction: column;
		}

		.ab-spinner-btn {
			flex: 1;
			padding: 0 0.5rem;
			border: none;
			background: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			user-select: none;
		}

		.ab-spinner-btn::before {
			content: '';
			position: absolute;
			width: 6px;
			height: 6px;
			border-top: 1px solid #162d55;
			border-right: 1px solid #162d55;
			transform: translateY(5px) rotate(-45deg);
			left: 4px;
		}

		.ab-spinner-btn::after {
			content: '';
			position: absolute;
			width: 6px;
			height: 6px;
			border-bottom: 1px solid #162d55;
			border-right: 1px solid #162d55;
			transform: translateY(-6px) rotate(45deg);
			right: 5px;
		}

		.ab-spinner-btn[data-action="decrement"]::before {
			display: none;
		}

		.ab-spinner-btn[data-action="increment"]::after {
			display: none;
		}

		.ab-spinner-btn:hover::before,
		.ab-spinner-btn:hover::after {
			border-color: #0d1929;
		}

		/* ===== BUTTON ===== */
		.ab-button-container {
			display: flex;
			justify-content: center;
			margin-top: 1rem;
		}

		.ab-search-btn {
			padding: 0.75rem 3rem;
			background-color: #162d55;
			color: white;
			font-weight: bold;
			border: none;
			border-radius: 9999px;
			cursor: pointer;
			font-size: 1rem;
			transition: opacity 0.2s;
		}

		.ab-search-btn:hover {
			opacity: 0.9;
		}

		/* ===== RESULTS SECTION ===== */
		.ab-results-section {
			background: #f9fafb;
			padding: 1rem 1rem;
		}

		.ab-results-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.ab-results-title {
			font-size: 1.875rem;
			font-weight: 300;
			color: #9ca3af;
			margin: 0;
			text-align: center;
		}

		.ab-filter-btn {
			/* display: flex;
			align-items: center; */
			/* gap: 0.5rem; */
			position: absolute;
			right: 0;
			padding: 0.5rem 1rem;
			background: white;
			border: none;
			border-radius: 9999px;
			cursor: pointer;
			font-weight: 500;
			color: #374151;
		}

		.ab-filter-btn:hover {
			background: #f3f4f6;
		}

		.ab-sort-icon {
			width: 1.25rem;
			height: 1.25rem;
		}

		.ab-message {
			text-align: center;
			color: #666;
			font-size: 0.9rem;
			margin-bottom: 1rem;
		}

		.ab-results-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}

		/* ===== YACHT CARD ===== */
		.ab-yacht-card {
			background: white;
			border-radius: 0.5rem;
			overflow: hidden;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			transition: box-shadow 0.2s;
		}

		.ab-yacht-card:hover {
			box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
		}

		.ab-yacht-image {
			width: 100%;
			height: 12rem;
			background: #d1d5db;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.ab-yacht-body {
			padding: 1.5rem;
			text-align: left;
			text-align: center;
		}

		.ab-yacht-title {
			font-size: .9rem;
			font-weight: 600;
			margin: 0 0 0.5rem;
			color: #162d55;
		}

		.ab-yacht-price {
			font-size: 1rem;
			font-weight: bold;
			color: #857f7f;
			margin: 0 0 .5rem;
			font-family: arial;
		}

		.ab-yacht-location {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			color: #666;
			margin-bottom: 1.5rem;
			font-size: 0.875rem;
		}

		.ab-yacht-location svg {
			width: 1.25rem;
			height: 1.25rem;
			flex-shrink: 0;
		}

		.ab-yacht-btn {
			width: 100%;
			padding: 0.5rem 2rem;
			background: #162d55;
			color: white;
			border: none;
			border-radius: 9999px;
			font-weight: bold;
			cursor: pointer;
			text-decoration: none;
			font-size: 0.875rem;
		}

		.ab-yacht-btn:hover {
			background: #0d1929;
		}

		/* ===== PAGINATION ===== */
		.ab-pagination {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.5rem;
			margin-top: 2rem;
			flex-wrap: wrap;
		}

		.ab-pagination button,
		.ab-pagination span {
			padding: 0.5rem 0.75rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			background: white;
			cursor: pointer;
			font-size: 0.875rem;
			transition: all 0.2s;
		}

		.ab-pagination button {
			color: #162d55;
		}

		.ab-pagination button:hover:not(:disabled) {
			background: #f3f4f6;
			border-color: #162d55;
		}

		.ab-pagination button:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.ab-pagination .active {
			background: #162d55;
			color: white;
			border-color: #162d55;
		}

		/* ===== RESET BUTTON ===== */
		.ab-reset-btn {
			padding: 0.4rem 0.55rem;
			border: 1px solid #d1d5db;
			border-radius: 0.375rem;
			background: white;
			color: #162d55;
			cursor: pointer;
			font-size: 1rem;
			/* font-weight: bold; */
			transition: all 0.2s;
			min-width: 40px;
			height: 37px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.ab-reset-btn:hover {
			background: #f3f4f6;
			border-color: #162d55;
			color: #162d55;
		}

		@media (max-width: 768px) {
			.ab-search-inputs {
				grid-template-columns: 1fr;
			}

			.ab-results-grid {
				grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			}
		}
	</style>

	<script>
	// Gestion des onglets
	(function() {
		const tabBtns = document.querySelectorAll('.ab-tab-btn');
		const tabPanes = document.querySelectorAll('.ab-tab-pane');

		tabBtns.forEach(btn => {
			btn.addEventListener('click', function() {
				const tabName = this.getAttribute('data-tab');

				// Retirer la classe active de tous les boutons et panes
				tabBtns.forEach(b => b.classList.remove('ab-tab-active'));
				tabPanes.forEach(p => p.classList.remove('ab-tab-active'));

				// Ajouter la classe active au bouton et pane cliqués
				this.classList.add('ab-tab-active');
				document.getElementById('ab-tab-' + tabName).classList.add('ab-tab-active');
			});
		});
	})();
	</script>

	<script>
	(function () {
		const endpointRecherche = '<?php echo esc_url_raw( rest_url( 'annuaire-bateau/v1/recherche' ) ); ?>';
		const endpointTypes    = '<?php echo esc_url_raw( rest_url( 'annuaire-bateau/v1/types' ) ); ?>';
		const endpointFiltrer  = '<?php echo esc_url_raw( rest_url( 'annuaire-bateau/v1/filtrer' ) ); ?>';

		/* ===== CUSTOM SELECT ===== */
		class CustomSelect {
			constructor(selectEl) {
				this.select = selectEl;
				this.wrapper = selectEl.closest('.ab-select-wrapper');
				this.trigger = this.wrapper.querySelector('.ab-select-trigger');
				this.options = this.wrapper.querySelector('.ab-select-options');
				this.init();
			}

			init() {
				this.updateOptions();
				this.trigger.addEventListener('click', () => this.toggleOpen());
				document.addEventListener('click', (e) => {
					if (!e.target.closest('.ab-select-wrapper') || !e.target.closest(this.wrapper)) {
						this.close();
					}
				});
			}

			updateOptions() {
				this.options.innerHTML = '';
				this.select.querySelectorAll('option').forEach(opt => {
					if (opt.value) {
						const li = document.createElement('li');
						li.className = 'ab-select-option';
						li.textContent = opt.textContent;
						li.dataset.value = opt.value;
						li.addEventListener('click', () => this.selectOption(opt.value, opt.textContent));
						this.options.appendChild(li);
					}
				});
			}

			toggleOpen() {
				if (this.options.classList.contains('open')) {
					this.close();
				} else {
					this.open();
				}
			}

			open() {
				this.options.classList.add('open');
				this.trigger.classList.add('active');
			}

			close() {
				this.options.classList.remove('open');
				this.trigger.classList.remove('active');
			}

			selectOption(value, text) {
				this.select.value = value;
				this.trigger.textContent = text;
				this.options.querySelectorAll('.ab-select-option').forEach(opt => {
					opt.classList.toggle('selected', opt.dataset.value === value);
				});
				this.close();
				// Déclencher l'événement change pour notifier les listeners
				this.select.dispatchEvent(new Event('change', { bubbles: true }));
			}
		}

		// Initialiser les selects - stockez les instances pour pouvoir les réutiliser
		const customSelects = {};
		document.querySelectorAll('.ab-select-native').forEach(sel => {
			const instance = new CustomSelect(sel);
			customSelects[sel.id] = instance;
		});

		/* ===== SEARCH FUNCTIONALITY ===== */
		const searchInput = document.getElementById('ab-search-input');
		const typeSelect = document.getElementById('ab-type-select');
		const searchBtn = document.getElementById('ab-search-btn');
		const message = document.getElementById('ab-message');
		const resultsGrid = document.getElementById('ab-results-grid');
		const paginationContainer = document.getElementById('ab-pagination');

		let searchTimer = null;
		let controller = null;
		let selectedContactId = null;
		let currentPage = 1;
		let currentFilters = {};

		// Créer un wrapper pour afficher les contacts
		const contactsDropdown = document.createElement('div');
		contactsDropdown.id = 'ab-contacts-dropdown';
		contactsDropdown.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d5db; border-top: none; border-radius: 0 0 0.375rem 0.375rem; max-height: 200px; overflow-y: auto; z-index: 10; display: none; list-style: none; margin: 0; padding: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);';
		searchInput.parentElement.style.position = 'relative';
		searchInput.parentElement.appendChild(contactsDropdown);

		// Recherche instantanée de contacts (3+ caractères)
		searchInput.addEventListener('input', function () {
			const terme = this.value.trim();
			selectedContactId = null;
			contactsDropdown.innerHTML = '';

			clearTimeout(searchTimer);

			if (terme.length < 3) {
				contactsDropdown.style.display = 'none';
				resultsGrid.innerHTML = '';
				message.hidden = true;
				return;
			}

			searchTimer = setTimeout(() => {
				if (controller) controller.abort();
				controller = new AbortController();

				fetch(endpointRecherche + '?terme=' + encodeURIComponent(terme), { signal: controller.signal })
					.then(r => r.json())
					.then(contacts => afficherContactsDropdown(contacts))
					.catch(err => {
						if (err.name !== 'AbortError') {
							afficherMessage('Erreur lors de la recherche.');
						}
					});
			}, 250);
		});

		function afficherContactsDropdown(contacts) {
			contactsDropdown.innerHTML = '';

			if (!Array.isArray(contacts) || contacts.length === 0) {
				// Afficher le message "pas de résultat trouvé" dans la dropdown
				const li = document.createElement('li');
				li.style.cssText = 'padding: 0.5rem; cursor: default; font-size: 0.875rem; color: #999; text-align: center;';
				li.textContent = 'Pas de résultat trouvé';
				contactsDropdown.appendChild(li);
				contactsDropdown.style.display = 'block';

				resultsGrid.innerHTML = '';
				message.hidden = true;
				return;
			}

			contacts.forEach(contact => {
				const li = document.createElement('li');
				li.style.cssText = 'padding: 0.5rem; cursor: pointer; font-size: 0.875rem; border-bottom: 1px solid #eee;';
				li.textContent = contact.nom;
				li.addEventListener('click', () => {
					selectedContactId = contact.id;
					searchInput.value = contact.nom;
					contactsDropdown.style.display = 'none';
					chargerBateauxContact(contact.id);
				});
				li.addEventListener('mouseover', () => {
					li.style.background = '#f3f4f6';
				});
				li.addEventListener('mouseout', () => {
					li.style.background = 'transparent';
				});
				contactsDropdown.appendChild(li);
			});

			contactsDropdown.style.display = 'block';
		}

		function chargerBateauxContact(contactId) {
			selectedContactId = contactId;
			chargerAvecFiltres({ contact: contactId }, 1);
		}

		// Fermer la dropdown en cliquant ailleurs
		document.addEventListener('click', (e) => {
			if (!e.target.closest('#ab-search-input') && !e.target.closest('#ab-contacts-dropdown')) {
				contactsDropdown.style.display = 'none';
			}
		});

		function chargerAvecFiltres(filters = {}, page = 1) {
			currentFilters = filters;
			currentPage = page;

			let url = endpointFiltrer + '?page=' + page;
			if (filters.contact) url += '&contact=' + filters.contact;
			if (filters.type) url += '&type=' + encodeURIComponent(filters.type);
			if (filters.length_min) url += '&length_min=' + filters.length_min;
			if (filters.length_max) url += '&length_max=' + filters.length_max;
			if (filters.year_min) url += '&year_min=' + filters.year_min;
			if (filters.year_max) url += '&year_max=' + filters.year_max;
			if (filters.price_min) url += '&price_min=' + filters.price_min;
			if (filters.price_max) url += '&price_max=' + filters.price_max;

			afficherMessage('Chargement...');
			fetch(url)
				.then(r => r.json())
				.then(data => afficherBateaux(data))
				.catch(() => afficherMessage('Erreur lors du chargement.'));
		}

		// Bouton reset filter
		document.getElementById('ab-reset-filter').addEventListener('click', function() {
			// Réinitialiser tous les filtres
			searchInput.value = '';
			typeSelect.value = '';
			document.getElementById('ab-length-min-select').value = '';
			document.getElementById('ab-length-max-select').value = '';
			document.getElementById('ab-year-min').value = '';
			document.getElementById('ab-year-max').value = '';
			document.getElementById('ab-price-min').value = '';
			document.getElementById('ab-price-max').value = '';

			selectedContactId = null;
			currentFilters = {};
			contactsDropdown.style.display = 'none';

			// Réinitialiser les triggers des custom selects
			if (customSelects['ab-type-select']) {
				customSelects['ab-type-select'].selectOption('', 'Select type');
			}

			// Charger tous les bateaux
			chargerAvecFiltres({}, 1);
		});

		// Charger les 12 premiers bateaux au chargement de la page
		window.addEventListener('load', () => {
			chargerAvecFiltres({}, 1);
		});

		// Charger les types au chargement
		fetch(endpointTypes)
			.then(r => r.json())
			.then(types => {
				const typeSelect = document.getElementById('ab-type-select');

				// Ajouter les types (les options vides existantes sont déjà là)
				types.forEach(type => {
					const opt = document.createElement('option');
					opt.value = type.slug;
					opt.textContent = type.label + ' (' + type.count + ')';
					typeSelect.appendChild(opt);
				});

				// Mettre à jour les options du CustomSelect
				if (customSelects['ab-type-select']) {
					customSelects['ab-type-select'].updateOptions();
				}

				// Événement pour filtrer instantanément quand on change le type
				typeSelect.addEventListener('change', function() {
					const selectedType = this.value;
					if (!selectedType) {
						// "Tous les types" sélectionné
						currentFilters.type = '';
						chargerAvecFiltres({}, 1);
					} else {
						currentFilters.type = selectedType;
						chargerAvecFiltres(currentFilters, 1);
					}
				});
			});

		// Recherche au clic sur Search Yacht
		searchBtn.addEventListener('click', function () {
			const filters = {
				contact:    selectedContactId || 0,
				type:       typeSelect.value || '',
				length_min: parseFloat(document.getElementById('ab-length-min-select').value) || 0,
				length_max: parseFloat(document.getElementById('ab-length-max-select').value) || 0,
				year_min:   parseInt(document.getElementById('ab-year-min').value) || 0,
				year_max:   parseInt(document.getElementById('ab-year-max').value) || 0,
				price_min:  parseInt(document.getElementById('ab-price-min').value) || 0,
				price_max:  parseInt(document.getElementById('ab-price-max').value) || 0,
			};

			chargerAvecFiltres(filters, 1);
		});

		function afficherBateaux(data) {
			resultsGrid.innerHTML = '';
			contactsDropdown.style.display = 'none';

			// Gérer la nouvelle structure avec pagination
			let bateaux = data;
			let pagination = null;

			if (data.bateaux) {
				bateaux = data.bateaux;
				pagination = data.pagination;
				currentPage = pagination.page;
				currentFilters = data.filters || {};
			}

			if (!Array.isArray(bateaux) || bateaux.length === 0) {
				afficherMessage('Aucun bateau trouvé.');
				paginationContainer.hidden = true;
				return;
			}

			afficherMessage((pagination ? pagination.total : bateaux.length) + ' bateau' + ((pagination ? pagination.total : bateaux.length) > 1 ? 'x' : '') + ' trouvé(s)');

			bateaux.forEach(bateau => {
				const card = document.createElement('div');
				card.className = 'ab-yacht-card';
				const titre = bateau.model || bateau.titre;
				const prix = bateau.prix_usd ? bateau.prix_usd.toLocaleString('en-US') : 'N/A';
				const localisation = bateau.localisation || 'Location';
				const imageUrl = bateau.image_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3Ctext x='150' y='100' font-size='16' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3E${titre}%3C/text%3E%3C/svg%3E`;

				card.innerHTML = `
					<div class="ab-yacht-image">
						<img src="${imageUrl}" alt="${titre}">
					</div>
					<div class="ab-yacht-body">
						<h3 class="ab-yacht-title">${titre}</h3>
						<p class="ab-yacht-price">${prix}&nbsp;$</p>
						<div class="ab-yacht-location">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>${localisation}</span>
						</div>
						<a href="${bateau.lien}" class="ab-yacht-btn">More Information</a>
					</div>
				`;
				resultsGrid.appendChild(card);
			});

			// Afficher la pagination
			if (pagination) {
				afficherPagination(pagination);
			} else {
				paginationContainer.hidden = true;
			}
		}

		function afficherPagination(pagination) {
			paginationContainer.innerHTML = '';

			if (pagination.total_pages <= 1) {
				paginationContainer.hidden = true;
				return;
			}

			paginationContainer.hidden = false;

			// Bouton Précédent
			const prevBtn = document.createElement('button');
			prevBtn.textContent = '← Précédent';
			prevBtn.disabled = pagination.page === 1;
			prevBtn.addEventListener('click', () => chargerPage(pagination.page - 1));
			paginationContainer.appendChild(prevBtn);

			// Numéros de page
			for (let i = 1; i <= pagination.total_pages; i++) {
				const pageBtn = document.createElement('button');
				pageBtn.textContent = i;
				if (i === pagination.page) {
					pageBtn.classList.add('active');
					pageBtn.disabled = true;
				}
				pageBtn.addEventListener('click', () => chargerPage(i));
				paginationContainer.appendChild(pageBtn);
			}

			// Bouton Suivant
			const nextBtn = document.createElement('button');
			nextBtn.textContent = 'Suivant →';
			nextBtn.disabled = pagination.page === pagination.total_pages;
			nextBtn.addEventListener('click', () => chargerPage(pagination.page + 1));
			paginationContainer.appendChild(nextBtn);
		}

		function chargerPage(page) {
			currentPage = page;
			// Recharger avec les filtres actuels
			chargerAvecFiltres(currentFilters, page);
		}

		function afficherMessage(texte) {
			message.textContent = texte;
			message.hidden = false;
		}

		// Spinner buttons
		document.querySelectorAll('.ab-spinner-btn').forEach(btn => {
			btn.addEventListener('click', function (e) {
				e.preventDefault();
				const input = this.closest('.ab-number-input').querySelector('input[type="number"]');
				const step = input.step || 1;
				const val = parseFloat(input.value) || 0;

				if (this.dataset.action === 'increment') {
					input.value = val + parseInt(step);
				} else {
					input.value = Math.max(val - parseInt(step), parseInt(input.min || 0));
				}
				input.dispatchEvent(new Event('change', { bubbles: true }));
			});
		});

		// Tri des bateaux
		let bateauxActuels = [];

		const originalAfficherBateaux = afficherBateaux;
		afficherBateaux = function(data) {
			// Stocker les bateaux actuels
			if (data.bateaux) {
				bateauxActuels = [...data.bateaux];
			} else if (Array.isArray(data)) {
				bateauxActuels = [...data];
			}

			// Appeler la fonction originale
			originalAfficherBateaux.call(this, data);
		};

		function afficherBateauxTries(bateauxTries) {
			resultsGrid.innerHTML = '';
			bateauxTries.forEach(bateau => {
				const card = document.createElement('div');
				card.className = 'ab-yacht-card';
				const titre = bateau.model || bateau.titre;
				const prix = bateau.prix_usd ? bateau.prix_usd.toLocaleString('en-US') : 'N/A';
				const localisation = bateau.localisation || 'Location';
				const imageUrl = bateau.image_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3Ctext x='150' y='100' font-size='16' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3E${titre}%3C/text%3E%3C/svg%3E`;

				card.innerHTML = `
					<div class="ab-yacht-image">
						<img src="${imageUrl}" alt="${titre}">
					</div>
					<div class="ab-yacht-body">
						<h3 class="ab-yacht-title">${titre}</h3>
						<p class="ab-yacht-price">${prix}&nbsp;$</p>
						<div class="ab-yacht-location">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>${localisation}</span>
						</div>
						<a href="${bateau.lien}" class="ab-yacht-btn">More Information</a>
					</div>
				`;
				resultsGrid.appendChild(card);
			});
		}

		const sortSelect = document.getElementById('ab-sort-select');
		sortSelect.addEventListener('change', function() {
			const sortType = this.value;
			if (!sortType || bateauxActuels.length === 0) return;

			let bateauxTries = [...bateauxActuels];

			if (sortType === 'price_low_high') {
				bateauxTries.sort((a, b) => (a.prix_usd || 0) - (b.prix_usd || 0));
			} else if (sortType === 'price_high_low') {
				bateauxTries.sort((a, b) => (b.prix_usd || 0) - (a.prix_usd || 0));
			} else if (sortType === 'newest') {
				bateauxTries.sort((a, b) => b.id - a.id);
			} else if (sortType === 'oldest') {
				bateauxTries.sort((a, b) => a.id - b.id);
			}

			// Réafficher les bateaux triés
			afficherBateauxTries(bateauxTries);
		});
	})();
	</script>
	<?php
} );
