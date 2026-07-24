<?php
/**
 * Fonctions utilitaires pour le plugin Annuaire Unifié
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// CPT et Taxonomies
define( 'AB_CPT_NAME', 'annuaire_bateau' );
define( 'AB_TAXONOMIE_TYPE', 'type_de_bateau' );
define( 'AM_TAXONOMIE_TYPE', 'type_de_contact' );

/**
 * Format boat data for API responses
 */
function ab_formater_bateaux( $posts ) {
	$bateaux = [];

	foreach ( $posts as $post ) {
		$image = '';
		if ( has_post_thumbnail( $post->ID ) ) {
			$image = get_the_post_thumbnail_url( $post->ID, 'medium' );
		}

		$bateaux[] = [
			'id'           => $post->ID,
			'title'        => $post->post_title,
			'price'        => get_post_meta( $post->ID, 'price', true ),
			'length'       => get_post_meta( $post->ID, 'length', true ),
			'year'         => get_post_meta( $post->ID, 'year', true ),
			'location'     => get_post_meta( $post->ID, 'location', true ),
			'image'        => $image,
			'contact'      => get_post_meta( $post->ID, 'contact_assoc', true ),
			'link'         => get_permalink( $post->ID ),
		];
	}

	return $bateaux;
}

/**
 * Format maritime contacts for API responses
 */
function am_liste_pays() {
	static $liste = null;

	if ( null === $liste ) {
		$liste = [];
		if ( class_exists( 'PodsForm' ) ) {
			$data = PodsForm::field_method( 'pick', 'data_countries' );
			if ( is_array( $data ) ) {
				$liste = $data;
			}
		}
	}

	return $liste;
}

function am_formater_contacts( $posts ) {
	$liste_pays = am_liste_pays();
	$resultats  = [];

	foreach ( $posts as $post ) {
		$codes = get_post_meta( $post->ID, 'pays', false );
		$pays  = [];

		foreach ( (array) $codes as $code ) {
			$sous_codes = is_array( $code ) ? $code : [ $code ];
			foreach ( $sous_codes as $c ) {
				if ( isset( $liste_pays[ $c ] ) && ! isset( $pays[ $c ] ) ) {
					$pays[ $c ] = [
						'code'  => strtolower( $c ),
						'label' => $liste_pays[ $c ],
					];
				}
			}
		}

		$resultats[] = [
			'id'        => $post->ID,
			'nom'       => get_post_meta( $post->ID, 'nom', true ),
			'prenom'    => get_post_meta( $post->ID, 'prenom', true ),
			'telephone' => get_post_meta( $post->ID, 'telephone', true ),
			'pays'      => array_values( $pays ),
			'lien'      => get_permalink( $post->ID ),
		];
	}

	return $resultats;
}
