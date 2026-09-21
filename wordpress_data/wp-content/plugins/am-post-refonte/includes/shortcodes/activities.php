<?php
/**
 * Shortcodes utilitaires pour le template de catégorie "Activities"
 * (fil d'Ariane, eyebrow, lien retour, compteur de résultats)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Terme « courant » pour le fil d'Ariane / eyebrow / lien retour :
 * le terme de l'archive sur une page catégorie ou tag, ou la catégorie
 * principale (Yoast) / première catégorie de l'article sur un post.
 */
function am_post_refonte_terme_courant() {
	if ( is_category() || is_tag() || is_tax() ) {
		$terme = get_queried_object();
		return $terme instanceof WP_Term ? $terme : null;
	}

	if ( is_singular( 'post' ) ) {
		$id_principale = get_post_meta( get_the_ID(), '_yoast_wpseo_primary_category', true );
		if ( $id_principale ) {
			$terme = get_term( (int) $id_principale, 'category' );
			if ( $terme && ! is_wp_error( $terme ) ) {
				return $terme;
			}
		}

		$categories = get_the_category();
		return $categories ? $categories[0] : null;
	}

	return null;
}

/**
 * [am_breadcrumb] - "Accueil · Activities · World luxury events"
 */
add_shortcode( 'am_breadcrumb', function () {
	$fil = [ '<a href="' . esc_url( home_url( '/' ) ) . '">Accueil</a>' ];

	$terme = am_post_refonte_terme_courant();
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
	$terme = am_post_refonte_terme_courant();
	if ( ! ( $terme instanceof WP_Term ) ) {
		return '';
	}

	return '<p class="am-activities-eyebrow">' . esc_html( 'Activities' ) . '</p>';
} );

/**
 * [am_back_link label="Back to all articles" arrow="left|right|none" class="..."]
 * Lien vers la catégorie parente (page catégorie) ou vers la catégorie de
 * l'article (article), utilisé aussi bien pour le lien retour en haut de
 * page que pour le bouton "View all articles" en bas d'article.
 */
add_shortcode( 'am_back_link', function ( $atts ) {
	$atts = shortcode_atts( [
		'label' => 'Back to all articles',
		'arrow' => 'left',
		'class' => 'am-activities-back-link',
	], $atts );

	$url   = home_url( '/' );
	$terme = am_post_refonte_terme_courant();
	if ( $terme instanceof WP_Term ) {
		$ancetres = get_ancestors( $terme->term_id, $terme->taxonomy );
		if ( $ancetres ) {
			$parent = get_term( $ancetres[0], $terme->taxonomy );
			if ( $parent && ! is_wp_error( $parent ) ) {
				$url = get_term_link( $parent );
			}
		}
	}

	$texte = esc_html( $atts['label'] );
	if ( 'right' === $atts['arrow'] ) {
		$texte .= ' &rarr;';
	} elseif ( 'left' === $atts['arrow'] ) {
		$texte = '&larr; ' . $texte;
	}

	return '<a class="' . esc_attr( $atts['class'] ) . '" href="' . esc_url( $url ) . '">' . $texte . '</a>';
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
