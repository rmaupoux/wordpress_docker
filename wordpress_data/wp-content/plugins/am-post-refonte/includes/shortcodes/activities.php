<?php
/**
 * Shortcodes utilitaires pour le template de catégorie "Activities"
 * (fil d'Ariane, eyebrow, lien retour, compteur de résultats)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * [am_breadcrumb] - "Accueil · Activities · World luxury events"
 */
add_shortcode( 'am_breadcrumb', function () {
	$fil = [ '<a href="' . esc_url( home_url( '/' ) ) . '">Accueil</a>' ];

	$terme = get_queried_object();
	if ( $terme instanceof WP_Term ) {
		$ancetres = array_reverse( get_ancestors( $terme->term_id, $terme->taxonomy ) );
		foreach ( $ancetres as $ancetre_id ) {
			$ancetre = get_term( $ancetre_id, $terme->taxonomy );
			if ( $ancetre && ! is_wp_error( $ancetre ) ) {
				$fil[] = '<a href="' . esc_url( get_term_link( $ancetre ) ) . '">' . esc_html( $ancetre->name ) . '</a>';
			}
		}
		$fil[] = '<span>' . esc_html( $terme->name ) . '</span>';
	}

	return '<nav class="am-activities-breadcrumb" aria-label="Fil d\'Ariane">'
		. implode( ' <span class="am-activities-breadcrumb-sep">&middot;</span> ', $fil )
		. '</nav>';
} );

/**
 * [am_eyebrow] - Nom de la catégorie racine (ex: "ACTIVITIES")
 */
add_shortcode( 'am_eyebrow', function () {
	$terme = get_queried_object();
	if ( ! ( $terme instanceof WP_Term ) ) {
		return '';
	}

	$ancetres = get_ancestors( $terme->term_id, $terme->taxonomy );
	if ( $ancetres ) {
		$racine = get_term( end( $ancetres ), $terme->taxonomy );
		$label  = ( $racine && ! is_wp_error( $racine ) ) ? $racine->name : $terme->name;
	} else {
		$label = $terme->name;
	}

	return '<p class="am-activities-eyebrow">' . esc_html( $label ) . '</p>';
} );

/**
 * [am_back_link label="Back to all articles"] - Lien vers la catégorie parente
 */
add_shortcode( 'am_back_link', function ( $atts ) {
	$atts = shortcode_atts( [ 'label' => 'Back to all articles' ], $atts );

	$url   = home_url( '/' );
	$terme = get_queried_object();
	if ( $terme instanceof WP_Term ) {
		$ancetres = get_ancestors( $terme->term_id, $terme->taxonomy );
		if ( $ancetres ) {
			$parent = get_term( $ancetres[0], $terme->taxonomy );
			if ( $parent && ! is_wp_error( $parent ) ) {
				$url = get_term_link( $parent );
			}
		}
	}

	return '<a class="am-activities-back-link" href="' . esc_url( $url ) . '">&larr; ' . esc_html( $atts['label'] ) . '</a>';
} );

/**
 * [am_result_count label="Articles"] - "Articles - 30 Results"
 */
add_shortcode( 'am_result_count', function ( $atts ) {
	$atts = shortcode_atts( [ 'label' => 'Articles' ], $atts );

	global $wp_query;
	$total = $wp_query instanceof WP_Query ? (int) $wp_query->found_posts : 0;

	return '<p class="am-activities-count"><strong>' . esc_html( $atts['label'] ) . ' - ' . number_format_i18n( $total ) . ' Results</strong></p>';
} );
