<?php
/**
 * Helpers utilisables comme "helper" de magic tag Pods dans les templates
 * (syntaxe {@field,helper_name,before,after} — before/after ne sont
 * affichés que si le helper renvoie une valeur non vide).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renvoie une coche si le champ boolean est vrai, une chaîne vide sinon.
 *
 * Pods ne traite pas un boolean_no_label vide comme une chaîne vide : sans
 * label configuré il retombe sur la valeur brute stockée ("0"), qui reste
 * "non vide" pour le moteur de magic tags (is_numeric("0") est vrai). On
 * passe donc par ce helper pour obtenir un vrai/faux PHP fiable.
 */
function annuaire_bateau_checked( $value ) {
	return $value ? '✓' : '';
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_checked';

	return $allowed;
} );
