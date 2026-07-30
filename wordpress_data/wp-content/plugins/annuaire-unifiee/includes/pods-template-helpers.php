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

/**
 * Génère un accordéon par groupe de champs Pods du pod "annuaire_bateau"
 * (sauf le groupe technique "Plus de champs"), contenant les champs
 * Yes/No cochés du groupe.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_bateau_equipment_accordions}.
 * Contrairement au reste du template (champs fixes), ceci lit la structure
 * des groupes/champs directement depuis Pods : ajouter un groupe ou un champ
 * Yes/No dans l'admin Pods suffit à le faire apparaître ici, sans toucher au
 * template.
 */
function annuaire_bateau_equipment_accordions( $id ) {
	$id = (int) $id;

	if ( ! $id ) {
		return '';
	}

	$pod_data = pods_api()->load_pod( array( 'name' => 'annuaire_bateau' ) );

	if ( empty( $pod_data['groups'] ) ) {
		return '';
	}

	$bateau = pods( 'annuaire_bateau', $id );
	$html   = '';

	foreach ( $pod_data['groups'] as $group ) {
		if ( 'plus_de_champs' === $group['name'] ) {
			continue;
		}

		$items = '';

		foreach ( $group['fields'] as $field ) {
			if ( 'boolean' !== $field['type'] ) {
				continue;
			}

			if ( ! $bateau->field( $field['name'] ) ) {
				continue;
			}

			$items .= sprintf(
				'<div class="ab-fiche-bateau-equip-item"><span class="ab-fiche-bateau-equip-check">✓</span> %s</div>',
				esc_html( $field['label'] )
			);
		}

		if ( '' === $items ) {
			continue;
		}

		$html .= sprintf(
			'<details class="ab-fiche-bateau-accordion"><summary>%s</summary><div class="ab-fiche-bateau-accordion-content ab-fiche-bateau-equip-grid">%s</div></details>',
			esc_html( mb_strtoupper( $group['label'], 'UTF-8' ) ),
			$items
		);
	}

	return $html;
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_equipment_accordions';

	return $allowed;
} );
