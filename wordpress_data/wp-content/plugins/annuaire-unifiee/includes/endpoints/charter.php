<?php
/**
 * Endpoints REST pour la recherche de bateaux en location (CHARTER),
 * utilisés par la page [annuaire_bateaux_filtres_charter] (js/charter-filtres.js) :
 * uniquement les bateaux portant le terme "rent" de la taxonomie
 * AB_TAXONOMIE_ACHAT, filtrés sur les champs du groupe Pods
 * "Charter Specification" (town/pays, seasonid, guests_charter, duration,
 * charter_price_min/max).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', function () {

	/* Destinations (villes) disponibles parmi les bateaux en charter : /wp-json/annuaire-bateau/v1/charter/destinations */
	register_rest_route( 'annuaire-bateau/v1', '/charter/destinations', array(
		'methods'             => 'GET',
		'callback'            => 'ab_charter_get_destinations',
		'permission_callback' => '__return_true',
	) );

	/* Options de la saison (champ Pods pick "seasonid") : /wp-json/annuaire-bateau/v1/charter/seasons */
	register_rest_route( 'annuaire-bateau/v1', '/charter/seasons', array(
		'methods'             => 'GET',
		'callback'            => 'ab_charter_get_seasons',
		'permission_callback' => '__return_true',
	) );

	/* Options de la durée (champ Pods pick "duration") : /wp-json/annuaire-bateau/v1/charter/durations */
	register_rest_route( 'annuaire-bateau/v1', '/charter/durations', array(
		'methods'             => 'GET',
		'callback'            => 'ab_charter_get_durations',
		'permission_callback' => '__return_true',
	) );

	/* Bateaux en charter avec filtres et pagination : /wp-json/annuaire-bateau/v1/charter/filtrer */
	register_rest_route( 'annuaire-bateau/v1', '/charter/filtrer', array(
		'methods'             => 'GET',
		'callback'            => 'ab_charter_filtrer_bateaux',
		'permission_callback' => '__return_true',
		'args'                => array(
			'destination' => array( 'sanitize_callback' => 'sanitize_text_field' ),
			'season'      => array( 'sanitize_callback' => 'sanitize_text_field' ),
			'duration'    => array( 'sanitize_callback' => 'sanitize_key' ),
			'guests'      => array( 'sanitize_callback' => function ( $v ) { return intval( $v ); } ),
			'price_min'   => array( 'sanitize_callback' => function ( $v ) { return intval( $v ); } ),
			'price_max'   => array( 'sanitize_callback' => function ( $v ) { return intval( $v ); } ),
			'page'        => array( 'sanitize_callback' => function ( $v ) { return max( 1, intval( $v ) ); }, 'default' => 1 ),
		),
	) );
} );

/**
 * Villes distinctes parmi les bateaux en charter (voir déjà
 * ab_tabs_get_charter_destinations() dans includes/shortcodes/tabs.php,
 * utilisée pour peupler le <select> du formulaire de recherche de
 * [annuaire_tabs] côté serveur) — exposée ici en REST pour la page de
 * filtres [annuaire_bateaux_filtres_charter], qui peuple ses listes en JS.
 */
function ab_charter_get_destinations() {
	$villes = function_exists( 'ab_tabs_get_charter_destinations' ) ? ab_tabs_get_charter_destinations() : array();

	return rest_ensure_response( array_map( function ( $ville ) {
		return array( 'value' => $ville, 'label' => $ville );
	}, $villes ) );
}

/**
 * Options du champ Pods pick "seasonid" (voir ab_tabs_get_pick_custom_options()
 * dans includes/shortcodes/tabs.php).
 */
function ab_charter_get_seasons() {
	$options = function_exists( 'ab_tabs_get_pick_custom_options' ) ? ab_tabs_get_pick_custom_options( 'seasonid' ) : array();

	$sortie = array();
	foreach ( $options as $valeur => $libelle ) {
		$sortie[] = array( 'value' => $valeur, 'label' => $libelle );
	}

	return rest_ensure_response( $sortie );
}

/**
 * Options du champ Pods pick "duration" (voir ab_tabs_get_pick_custom_options()
 * dans includes/shortcodes/tabs.php).
 */
function ab_charter_get_durations() {
	$options = function_exists( 'ab_tabs_get_pick_custom_options' ) ? ab_tabs_get_pick_custom_options( 'duration' ) : array();

	$sortie = array();
	foreach ( $options as $valeur => $libelle ) {
		$sortie[] = array( 'value' => $valeur, 'label' => $libelle );
	}

	return rest_ensure_response( $sortie );
}

/**
 * Filtre les bateaux en charter (terme "rent") selon Destination/Season/
 * Guests/Duration/Price, avec pagination.
 */
function ab_charter_filtrer_bateaux( WP_REST_Request $request ) {
	$destination = trim( $request->get_param( 'destination' ) ?: '' );
	$season      = trim( $request->get_param( 'season' ) ?: '' );
	$duration    = trim( $request->get_param( 'duration' ) ?: '' );
	$guests      = intval( $request->get_param( 'guests' ) ?: 0 );
	$price_min   = intval( $request->get_param( 'price_min' ) ?: 0 );
	$price_max   = intval( $request->get_param( 'price_max' ) ?: 0 );
	$page        = max( 1, intval( $request->get_param( 'page' ) ?: 1 ) );
	$per_page    = 12;

	$args = array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => $per_page,
		'paged'          => $page,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => AB_TAXONOMIE_ACHAT,
				'field'    => 'slug',
				'terms'    => 'rent',
			),
		),
		'meta_query'     => array( 'relation' => 'AND' ),
	);

	if ( '' !== $destination ) {
		$args['meta_query'][] = array(
			'key'   => 'town',
			'value' => $destination,
		);
	}

	if ( '' !== $season ) {
		$args['meta_query'][] = array(
			'key'   => 'seasonid',
			'value' => $season,
		);
	}

	if ( '' !== $duration ) {
		$args['meta_query'][] = array(
			'key'   => 'duration',
			'value' => $duration,
		);
	}

	if ( $guests > 0 ) {
		$args['meta_query'][] = array(
			'key'     => 'guests_charter',
			'value'   => $guests,
			'compare' => '>=',
			'type'    => 'NUMERIC',
		);
	}

	// Prix : chaque bateau porte sa propre plage charter_price_min/max (ex. tarif
	// basse/haute saison) ; on ne garde que les bateaux dont la plage recoupe le
	// budget demandé (chaque borne n'est comparée que si elle est renseignée).
	if ( $price_max > 0 ) {
		$args['meta_query'][] = array(
			'key'     => 'charter_price_min',
			'value'   => $price_max,
			'compare' => '<=',
			'type'    => 'NUMERIC',
		);
	}

	if ( $price_min > 0 ) {
		$args['meta_query'][] = array(
			'key'     => 'charter_price_max',
			'value'   => $price_min,
			'compare' => '>=',
			'type'    => 'NUMERIC',
		);
	}

	$query = new WP_Query( $args );

	return rest_ensure_response( array(
		'bateaux'    => ab_charter_formater_bateaux( $query->posts ),
		'pagination' => array(
			'page'        => $page,
			'per_page'    => $per_page,
			'total'       => $query->found_posts,
			'total_pages' => $query->max_num_pages,
		),
		'filters'    => array(
			'destination' => $destination,
			'season'      => $season,
			'duration'    => $duration,
			'guests'      => $guests,
			'price_min'   => $price_min,
			'price_max'   => $price_max,
		),
	) );
}

/**
 * Formate les bateaux en charter pour la réponse REST (même forme que
 * ab_formater_bateaux() dans includes/endpoints/bateaux.php, avec les champs
 * propres au charter en plus — voir js/charter-filtres.js :: creerCarteBateau).
 */
function ab_charter_formater_bateaux( $posts ) {
	$resultats = array();

	foreach ( $posts as $post ) {
		$image_url = get_the_post_thumbnail_url( $post->ID, 'medium_large' );
		if ( ! $image_url ) {
			$image_url = get_the_post_thumbnail_url( $post->ID, 'full' );
		}

		$resultats[] = array(
			'id'           => $post->ID,
			'titre'        => $post->post_title,
			'model'        => get_post_meta( $post->ID, 'model', true ),
			'localisation' => get_post_meta( $post->ID, 'town', true ),
			'guests'       => intval( get_post_meta( $post->ID, 'guests_charter', true ) ),
			'prix_min_euros' => intval( get_post_meta( $post->ID, 'charter_price_min', true ) ),
			'prix_max_euros' => intval( get_post_meta( $post->ID, 'charter_price_max', true ) ),
			'lien'         => get_permalink( $post->ID ),
			'image_url'    => $image_url,
		);
	}

	return $resultats;
}
