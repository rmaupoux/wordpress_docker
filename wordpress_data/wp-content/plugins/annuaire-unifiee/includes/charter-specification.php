<?php
/**
 * Le groupe de champs Pods "Charter Specification" (Crew / Guest cruising /
 * Guest sleeping) n'a de sens que pour les fiches en location (terme "rent"
 * de AB_TAXONOMIE_ACHAT). L'éditeur par blocs fige la liste des metaboxes au
 * chargement initial de la page : les masquer côté PHP avec
 * remove_meta_box() les empêcherait de réapparaître tant que la page n'est
 * pas rechargée, y compris juste après avoir coché "Rent" et enregistré.
 *
 * La metabox reste donc toujours enregistrée par Pods ; c'est
 * js/charter-specification.js (écran d'édition de AB_CPT_NAME uniquement)
 * qui l'affiche/la masque en direct en observant la case à cocher "Rent" de
 * la taxonomie dans le panneau latéral de l'éditeur.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_enqueue_scripts', 'ab_enqueue_script_charter_specification' );

function ab_enqueue_script_charter_specification( $hook ) {
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
		return;
	}

	$screen = get_current_screen();

	if ( ! $screen || AB_CPT_NAME !== $screen->post_type ) {
		return;
	}

	$terme_rent = get_term_by( 'slug', 'rent', AB_TAXONOMIE_ACHAT );

	wp_enqueue_script(
		'annuaire-unifiee-charter-specification',
		ANNUAIRE_UNIFIEE_URL . 'js/charter-specification.js',
		array( 'wp-data', 'wp-dom-ready' ),
		ANNUAIRE_UNIFIEE_VERSION,
		true
	);

	wp_localize_script( 'annuaire-unifiee-charter-specification', 'AnnuaireUnifieeCharter', array(
		'metaBoxId'  => 'pods-meta-charter-specification',
		'taxonomy'   => AB_TAXONOMIE_ACHAT,
		'termIdRent' => $terme_rent ? $terme_rent->term_id : 0,
	) );
}
