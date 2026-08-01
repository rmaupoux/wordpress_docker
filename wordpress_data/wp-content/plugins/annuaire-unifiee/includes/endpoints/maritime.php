<?php
/**
 * Endpoints REST pour les contacts maritimes (annuaire/v1/*)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * Fonctions utilitaires (liste des pays, formatage des contacts)
 * ---------------------------------------------------------------------- */

function am_liste_pays() {
	static $liste = null;

	if ( null === $liste ) {
		$liste = array();
		if ( class_exists( 'PodsForm' ) ) {
			$data = PodsForm::field_method( 'pick', 'data_countries' );
			if ( is_array( $data ) ) {
				$liste = $data;
			}
		}
	}

	return $liste;
}

/**
 * Transforme une liste de posts annuaire_maritime en tableau de contacts
 * pour la réponse REST (drapeaux : code ISO minuscule + libellé).
 */
function am_formater_contacts( $posts ) {
	$liste_pays = am_liste_pays();
	$resultats  = array();

	foreach ( $posts as $post ) {
		/* Le champ "pays" stocke le code ISO ('FR') : on renvoie le code
		   (pour le drapeau) et le libellé (pour l'infobulle / alt). */
		$codes = get_post_meta( $post->ID, 'pays', false ); // false = toutes les valeurs (multi-sélection possible)
		$pays  = array();

		foreach ( (array) $codes as $code ) {
			$sous_codes = is_array( $code ) ? $code : array( $code ); // valeur éventuellement sérialisée
			foreach ( $sous_codes as $c ) {
				if ( isset( $liste_pays[ $c ] ) && ! isset( $pays[ $c ] ) ) {
					$pays[ $c ] = array(
						'code'  => strtolower( $c ),
						'label' => $liste_pays[ $c ],
					);
				}
			}
		}

		$termes_type = get_the_terms( $post->ID, AM_TAXONOMIE_TYPE );
		$type_label  = ( ! empty( $termes_type ) && ! is_wp_error( $termes_type ) ) ? $termes_type[0]->name : '';

		$resultats[] = array(
			'id'        => $post->ID,
			'nom'       => get_post_meta( $post->ID, 'nom', true ),
			'prenom'    => get_post_meta( $post->ID, 'prenom', true ),
			'telephone' => get_post_meta( $post->ID, 'telephone', true ),
			'type'      => $type_label,
			'pays'      => array_values( $pays ),
			'lien'      => get_permalink( $post->ID ),
		);
	}

	return $resultats;
}

/* -------------------------------------------------------------------------
 * Endpoints REST
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', function () {

	/* Recherche par nom / prénom : /wp-json/annuaire/v1/recherche?terme=xxx */
	register_rest_route( 'annuaire/v1', '/recherche', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_recherche',
		'permission_callback' => '__return_true', // recherche publique
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

	/* Liste des pays réellement utilisés : /wp-json/annuaire/v1/pays */
	register_rest_route( 'annuaire/v1', '/pays', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_pays_utilises',
		'permission_callback' => '__return_true',
	) );

	/* Contacts d'un pays : /wp-json/annuaire/v1/par-pays?code=FR */
	register_rest_route( 'annuaire/v1', '/par-pays', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_par_pays',
		'permission_callback' => '__return_true',
		'args'                => array(
			'code' => array(
				'required'          => true,
				'sanitize_callback' => function ( $value ) {
					return strtoupper( sanitize_text_field( $value ) );
				},
				'validate_callback' => function ( $value ) {
					return (bool) preg_match( '/^[A-Za-z]{2}$/', $value );
				},
			),
		),
	) );

	/* Termes de la taxonomie type_de_contact : /wp-json/annuaire/v1/types */
	register_rest_route( 'annuaire/v1', '/types', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_types',
		'permission_callback' => '__return_true',
	) );

	/* Contacts d'un type : /wp-json/annuaire/v1/par-type?type=slug-du-terme */
	register_rest_route( 'annuaire/v1', '/par-type', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_par_type',
		'permission_callback' => '__return_true',
		'args'                => array(
			'type' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_title',
				'validate_callback' => function ( $value ) {
					return '' !== trim( $value );
				},
			),
		),
	) );
} );

/** Recherche par nom / prénom (10 résultats max). */
function annuaire_maritime_recherche( WP_REST_Request $request ) {
	$terme = trim( $request->get_param( 'terme' ) );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'nom',
				'value'   => $terme,
				'compare' => 'LIKE',
			),
			array(
				'key'     => 'prenom',
				'value'   => $terme,
				'compare' => 'LIKE',
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}

/**
 * Liste des pays présents dans l'annuaire (pour la liste déroulante),
 * triée par libellé. Seuls les pays ayant au moins un contact publié
 * sont proposés.
 */
function annuaire_maritime_pays_utilises() {
	global $wpdb;

	$codes = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT pm.meta_value
		 FROM {$wpdb->postmeta} pm
		 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		 WHERE pm.meta_key = %s
		   AND p.post_type = %s
		   AND p.post_status = 'publish'",
		'pays',
		'annuaire_maritime'
	) );

	$liste_pays = am_liste_pays();
	$pays       = array();

	foreach ( (array) $codes as $code ) {
		$code = strtoupper( trim( (string) $code ) );
		if ( isset( $liste_pays[ $code ] ) && ! isset( $pays[ $code ] ) ) {
			$pays[ $code ] = array(
				'code'  => strtolower( $code ),
				'label' => $liste_pays[ $code ],
			);
		}
	}

	/* Tri alphabétique insensible aux accents */
	usort( $pays, function ( $a, $b ) {
		return strcasecmp( remove_accents( $a['label'] ), remove_accents( $b['label'] ) );
	} );

	return rest_ensure_response( array_values( $pays ) );
}

/** Tous les contacts liés à un pays donné. */
function annuaire_maritime_par_pays( WP_REST_Request $request ) {
	$code = $request->get_param( 'code' );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => -1, // tous les contacts du pays
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			array(
				'key'     => 'pays',
				'value'   => $code,
				'compare' => '=',
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}

/**
 * Termes de la taxonomie type_de_contact ayant au moins un contact
 * (hide_empty), avec leur nombre de contacts.
 */
function annuaire_maritime_types() {
	$termes = get_terms( array(
		'taxonomy'   => AM_TAXONOMIE_TYPE,
		'hide_empty' => true,
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

/** Tous les contacts liés à un terme de la taxonomie. */
function annuaire_maritime_par_type( WP_REST_Request $request ) {
	$slug = $request->get_param( 'type' );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => -1, // tous les contacts du type
		'orderby'        => 'title',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => AM_TAXONOMIE_TYPE,
				'field'    => 'slug',
				'terms'    => $slug,
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}
