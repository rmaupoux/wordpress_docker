<?php
/**
 * Variables Yoast SEO dynamiques pour les fiches annuaire_bateau.
 *
 * Cause du problème SEO constaté (audit) : le contenu descriptif des fiches
 * (texte, specs...) est stocké dans des champs Pods, pas dans post_content
 * (qui reste vide sur ces fiches, généré via bloc Pods côté template FSE).
 * Yoast n'a donc aucun texte à analyser et ne génère ni titre ni meta
 * description pertinents automatiquement.
 *
 * Ce fichier expose le type, la longueur, l'année et le prix (déjà saisis
 * dans Pods) comme variables %%...%% réutilisables dans les templates de
 * titre/meta description du CPT (Réglages SEO > Types de contenu > Bateaux),
 * sans avoir à ressaisir ces données fiche par fiche.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wpseo_register_extra_replacements', 'ab_register_yoast_replacements' );

function ab_register_yoast_replacements() {
	if ( ! function_exists( 'wpseo_register_var_replacement' ) ) {
		return;
	}

	wpseo_register_var_replacement(
		'%%ab_titre_seo%%',
		'ab_yoast_titre_seo',
		'advanced',
		'Suffixe de titre pour une fiche bateau : type, longueur, année et prix (ex: " - 29ft Motor Yacht (1993) For Sale - €583,199")'
	);

	wpseo_register_var_replacement(
		'%%ab_description_seo%%',
		'ab_yoast_description_seo',
		'advanced',
		'Meta description générée à partir des champs Pods d\'une fiche bateau'
	);
}

/**
 * Récupère le nom du type de bateau (taxonomie type_de_bateau) de la fiche courante.
 */
function ab_yoast_type_bateau( $post_id ) {
	$termes = get_the_terms( $post_id, AB_TAXONOMIE_TYPE );

	return ( $termes && ! is_wp_error( $termes ) ) ? $termes[0]->name : '';
}

/**
 * Formate le prix (champ Pods "asking_price", en euros) pour affichage,
 * ou chaîne vide si non renseigné (au lieu d'un "€0" trompeur).
 */
function ab_yoast_prix_seo( $post_id ) {
	$prix = intval( get_post_meta( $post_id, 'asking_price', true ) );

	return $prix > 0 ? '€' . number_format_i18n( $prix ) : '';
}

function ab_yoast_titre_seo() {
	if ( ! is_singular( AB_CPT_NAME ) ) {
		return '';
	}

	$post_id  = get_the_ID();
	$type     = ab_yoast_type_bateau( $post_id );
	$longueur = floatval( get_post_meta( $post_id, 'lenght_ft', true ) );
	$annee    = intval( get_post_meta( $post_id, 'year', true ) );
	$prix     = ab_yoast_prix_seo( $post_id );

	// Segment "29ft Motor Yacht" : dans cet ordre pour rester lisible même si
	// l'un des deux manque ("Motor Yacht" seul, ou "29ft" seul).
	$segment = trim( ( $longueur > 0 ? $longueur . 'ft ' : '' ) . $type );

	$morceaux = array();
	if ( $segment ) {
		$morceaux[] = $segment;
	}
	if ( $annee > 0 ) {
		$morceaux[] = '(' . $annee . ')';
	}
	if ( $morceaux ) {
		$morceaux[] = 'For Sale';
	}
	if ( $prix ) {
		$morceaux[] = '- ' . $prix;
	}

	return $morceaux ? ' - ' . implode( ' ', $morceaux ) : '';
}

function ab_yoast_description_seo() {
	if ( ! is_singular( AB_CPT_NAME ) ) {
		return '';
	}

	$post_id      = get_the_ID();
	$nom          = get_the_title( $post_id );
	$type         = ab_yoast_type_bateau( $post_id ) ?: 'yacht';
	$annee        = intval( get_post_meta( $post_id, 'year', true ) );
	$longueur     = floatval( get_post_meta( $post_id, 'lenght_ft', true ) );
	$prix         = ab_yoast_prix_seo( $post_id );
	$localisation = get_post_meta( $post_id, 'town', true );

	$phrase = sprintf( '%s: %s%s for sale', $nom, $annee > 0 ? $annee . ' ' : '', $type );

	if ( $localisation ) {
		$phrase .= ', located in ' . $localisation;
	}
	if ( $longueur > 0 ) {
		$phrase .= ', ' . $longueur . ' ft';
	}
	$phrase .= $prix ? '. Priced at ' . $prix . '.' : '. Price on request.';
	$phrase .= ' See full specs, photos and contact details on Yachtma.';

	return $phrase;
}
