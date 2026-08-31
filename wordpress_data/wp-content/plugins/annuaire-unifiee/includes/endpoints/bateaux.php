<?php
/**
 * Endpoints REST pour les bateaux (annuaire-bateau/v1/*)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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

	/* Recherche de bateaux par modèle : /wp-json/annuaire-bateau/v1/recherche-modeles?terme=xxx */
	register_rest_route( 'annuaire-bateau/v1', '/recherche-modeles', array(
		'methods'             => 'GET',
		'callback'            => 'ab_recherche_modeles',
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

	/* Bateaux à la une : /wp-json/annuaire-bateau/v1/a-la-une */
	register_rest_route( 'annuaire-bateau/v1', '/a-la-une', array(
		'methods'             => 'GET',
		'callback'            => 'ab_bateaux_a_la_une',
		'permission_callback' => '__return_true',
	) );

	/* Types de bateau : /wp-json/annuaire-bateau/v1/types */
	register_rest_route( 'annuaire-bateau/v1', '/types', array(
		'methods'             => 'GET',
		'callback'            => 'ab_get_types',
		'permission_callback' => '__return_true',
	) );

	/* Pays présents parmi les bateaux (champ Pods "pick" pays) : /wp-json/annuaire-bateau/v1/pays */
	register_rest_route( 'annuaire-bateau/v1', '/pays', array(
		'methods'             => 'GET',
		'callback'            => 'ab_get_pays',
		'permission_callback' => '__return_true',
	) );

	/* Autocomplétion (3+ caractères) sur les valeurs existantes d'un champ texte
	   (whitelist AB_CHAMPS_AUTOCOMPLETE) : /wp-json/annuaire-bateau/v1/valeurs-champ?champ=xxx&terme=yyy */
	register_rest_route( 'annuaire-bateau/v1', '/valeurs-champ', array(
		'methods'             => 'GET',
		'callback'            => 'ab_get_valeurs_champ',
		'permission_callback' => '__return_true',
		'args'                => array(
			'champ' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_key',
				'validate_callback' => function ( $value ) {
					return array_key_exists( sanitize_key( $value ), AB_CHAMPS_AUTOCOMPLETE );
				},
			),
			'terme' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => function ( $value ) {
					return mb_strlen( trim( $value ) ) >= 3;
				},
			),
		),
	) );

	/* Bateaux avec filtres et pagination : /wp-json/annuaire-bateau/v1/filtrer */
	register_rest_route( 'annuaire-bateau/v1', '/filtrer', array(
		'methods'             => 'GET',
		'callback'            => 'ab_filtrer_bateaux',
		'permission_callback' => '__return_true',
		'args'                => array(
			'contact'    => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'model'      => array( 'sanitize_callback' => 'sanitize_text_field' ),
			'type'       => array( 'sanitize_callback' => 'sanitize_title' ),
			'length_min' => array( 'sanitize_callback' => function( $v ) { return floatval( $v ); } ),
			'length_max' => array( 'sanitize_callback' => function( $v ) { return floatval( $v ); } ),
			'year_min'   => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'year_max'   => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'price_min'  => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			'price_max'  => array( 'sanitize_callback' => function( $v ) { return intval( $v ); } ),
			// Slugs cochés dans le filtre "Technical equipements" (ab_filtrer_bateaux les
			// cumule en ET) : on ne garde que les clés connues de AB_EQUIPEMENTS_TECHNIQUES.
			'equipements' => array(
				'sanitize_callback' => function ( $v ) {
					if ( ! is_array( $v ) ) {
						return array();
					}
					return array_values( array_intersect( array_map( 'sanitize_key', $v ), array_keys( AB_EQUIPEMENTS_TECHNIQUES ) ) );
				},
			),
			// Champs texte libres (LIKE), ex. champs_texte[town]=Cannes&champs_texte[builder]=Sunseeker
			// — seules les clés connues de AB_CHAMPS_TEXTE sont conservées.
			'champs_texte' => array(
				'sanitize_callback' => function ( $v ) {
					if ( ! is_array( $v ) ) {
						return array();
					}
					$sortie = array();
					foreach ( $v as $slug => $valeur ) {
						$slug = sanitize_key( $slug );
						if ( isset( AB_CHAMPS_TEXTE[ $slug ] ) && '' !== trim( (string) $valeur ) ) {
							$sortie[ $slug ] = sanitize_text_field( $valeur );
						}
					}
					return $sortie;
				},
			),
			// Champs numériques en plage min/max, ex. champs_numeriques[cabins][min]=2&...[max]=5
			// — seules les clés connues de AB_CHAMPS_NUMERIQUES sont conservées.
			'champs_numeriques' => array(
				'sanitize_callback' => function ( $v ) {
					if ( ! is_array( $v ) ) {
						return array();
					}
					$sortie = array();
					foreach ( $v as $slug => $plage ) {
						$slug = sanitize_key( $slug );
						if ( ! isset( AB_CHAMPS_NUMERIQUES[ $slug ] ) || ! is_array( $plage ) ) {
							continue;
						}
						$min = isset( $plage['min'] ) ? floatval( $plage['min'] ) : 0;
						$max = isset( $plage['max'] ) ? floatval( $plage['max'] ) : 0;
						if ( $min > 0 || $max > 0 ) {
							$sortie[ $slug ] = array( 'min' => $min, 'max' => $max );
						}
					}
					return $sortie;
				},
			),
			'pays'       => array( 'sanitize_callback' => 'sanitize_text_field' ),
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
 * Recherche les bateaux dont le modèle correspond au terme (3+ caractères, 10 résultats max)
 */
function ab_recherche_modeles( WP_REST_Request $request ) {
	global $wpdb;
	$terme     = trim( $request->get_param( 'terme' ) );
	$like_term = '%' . $wpdb->esc_like( $terme ) . '%';

	$results = $wpdb->get_results( $wpdb->prepare(
		"SELECT p.ID, pm.meta_value AS model
		 FROM {$wpdb->posts} p
		 INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = 'model'
		 WHERE p.post_type = %s
		 AND p.post_status = 'publish'
		 AND pm.meta_value LIKE %s
		 ORDER BY pm.meta_value ASC
		 LIMIT 10",
		array( AB_CPT_NAME, $like_term )
	) );

	$resultats = array();
	foreach ( $results as $row ) {
		$resultats[] = array(
			'id'    => (int) $row->ID,
			'model' => $row->model,
			'url'   => get_permalink( $row->ID ),
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
 * Retourne les bateaux marqués "à la une"
 */
function ab_bateaux_a_la_une() {
	$query = new WP_Query( array(
		'post_type'      => AB_CPT_NAME,
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			array(
				'key'   => 'a_la_une',
				'value' => '1',
			),
		),
	) );

	return rest_ensure_response( ab_formater_bateaux( $query->posts ) );
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
 * Récupère les codes pays distincts présents parmi les bateaux (champ Pods
 * "pick" pays) : pas de correspondance code -> nom, voir AB_CHAMP_PAYS_SLUG
 * dans includes/helpers.php.
 */
function ab_get_pays() {
	global $wpdb;

	$codes = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT pm.meta_value
		 FROM {$wpdb->postmeta} pm
		 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		 WHERE pm.meta_key = %s
		 AND pm.meta_value != ''
		 AND p.post_type = %s
		 AND p.post_status = 'publish'
		 ORDER BY pm.meta_value ASC",
		array( AB_CHAMP_PAYS_SLUG, AB_CPT_NAME )
	) );

	return rest_ensure_response( array_map( function ( $code ) {
		return array( 'code' => $code, 'label' => $code );
	}, $codes ) );
}

/**
 * Valeurs distinctes existantes pour un champ texte (autocomplétion), limitées
 * à la whitelist AB_CHAMPS_AUTOCOMPLETE (voir validate_callback ci-dessus et
 * includes/helpers.php).
 */
function ab_get_valeurs_champ( WP_REST_Request $request ) {
	global $wpdb;
	$champ     = $request->get_param( 'champ' );
	$terme     = trim( $request->get_param( 'terme' ) );
	$like_term = '%' . $wpdb->esc_like( $terme ) . '%';

	$valeurs = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT pm.meta_value
		 FROM {$wpdb->postmeta} pm
		 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		 WHERE pm.meta_key = %s
		 AND pm.meta_value LIKE %s
		 AND pm.meta_value != ''
		 AND p.post_type = %s
		 AND p.post_status = 'publish'
		 ORDER BY pm.meta_value ASC
		 LIMIT 10",
		array( $champ, $like_term, AB_CPT_NAME )
	) );

	return rest_ensure_response( $valeurs );
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
	$model      = trim( $request->get_param( 'model' ) ?: '' );
	$type       = trim( $request->get_param( 'type' ) ?: '' );
	$length_min = floatval( $request->get_param( 'length_min' ) ?: 0 );
	$length_max = floatval( $request->get_param( 'length_max' ) ?: PHP_INT_MAX );
	$year_min   = intval( $request->get_param( 'year_min' ) ?: 0 );
	$year_max   = intval( $request->get_param( 'year_max' ) ?: 9999 );
	$price_min  = intval( $request->get_param( 'price_min' ) ?: 0 );
	$price_max  = intval( $request->get_param( 'price_max' ) ?: PHP_INT_MAX );
	$equipements = (array) ( $request->get_param( 'equipements' ) ?: array() );
	$champs_texte      = (array) ( $request->get_param( 'champs_texte' ) ?: array() );
	$champs_numeriques = (array) ( $request->get_param( 'champs_numeriques' ) ?: array() );
	$pays       = trim( $request->get_param( 'pays' ) ?: '' );
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

	// Filtre par modèle (retrouve les bateaux partageant le même champ "model")
	if ( ! empty( $model ) ) {
		$args['meta_query'][] = array(
			'key'     => 'model',
			'value'   => $model,
			'compare' => 'LIKE',
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

	// Filtres équipements techniques (checkboxes) : cumul en ET, un meta_query par équipement coché
	foreach ( $equipements as $slug ) {
		$args['meta_query'][] = array(
			'key'   => $slug,
			'value' => '1',
		);
	}

	// Filtres texte libres ("Plus de champs" / "Engine") : cumul en ET, un meta_query LIKE par champ rempli
	foreach ( $champs_texte as $slug => $valeur ) {
		$args['meta_query'][] = array(
			'key'     => $slug,
			'value'   => $valeur,
			'compare' => 'LIKE',
		);
	}

	// Filtres numériques en plage ("Plus de champs" / "Engine") : cumul en ET, un meta_query BETWEEN par champ rempli
	foreach ( $champs_numeriques as $slug => $plage ) {
		$args['meta_query'][] = array(
			'key'     => $slug,
			'value'   => array( $plage['min'], $plage['max'] ?: PHP_INT_MAX ),
			'compare' => 'BETWEEN',
			'type'    => 'NUMERIC',
		);
	}

	// Filtre pays (champ Pods "pick")
	if ( ! empty( $pays ) ) {
		$args['meta_query'][] = array(
			'key'   => AB_CHAMP_PAYS_SLUG,
			'value' => $pays,
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
			'model'      => $model,
			'type'       => $type,
			'length_min' => $length_min,
			'length_max' => $length_max,
			'year_min'   => $year_min,
			'year_max'   => $year_max,
			'price_min'  => $price_min,
			'price_max'  => $price_max,
			'equipements' => $equipements,
			'champs_texte'      => $champs_texte,
			'champs_numeriques' => $champs_numeriques,
			'pays'              => $pays,
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
		$image_url = get_the_post_thumbnail_url( $post->ID, 'medium_large' );
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
			'prix_euros'    => intval( get_post_meta( $post->ID, 'asking_price', true ) ),
			'localisation'  => get_post_meta( $post->ID, 'town', true ),
			'lien'          => get_permalink( $post->ID ),
			'image_url'     => $image_url,
			'a_la_une'      => get_post_meta( $post->ID, 'a_la_une', true ) === '1',
		);
	}

	return $resultats;
}
