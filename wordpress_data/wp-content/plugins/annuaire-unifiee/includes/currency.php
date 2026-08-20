<?php
/**
 * Taux de change pour le sélecteur de devise des prix bateaux (asking_price,
 * stocké en USD). Voir includes/pods-template-helpers.php, includes/shortcodes/bateaux.php,
 * includes/endpoints/bateaux.php et js/currency.js.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AB_DEVISE_BASE', 'USD' );

// Parité fixe AED/USD maintenue par la Banque centrale des Émirats arabes unis
// depuis 1997 : ce n'est pas un taux de marché, donc pas besoin de l'API.
define( 'AB_TAUX_AED_FIXE', 3.6725 );

/**
 * Taux de change USD -> devise, mis en cache 24h dans un transient.
 * Source : frankfurter.app (taux de référence quotidiens de la BCE, sans clé API).
 * En cas d'échec de l'appel, on retombe sur des taux approximatifs codés en dur
 * plutôt que d'afficher des prix vides.
 */
function ab_get_taux_change() {
	$taux = get_transient( 'ab_taux_change' );

	if ( is_array( $taux ) ) {
		return $taux;
	}

	// Valeurs de repli si l'API est indisponible.
	$taux = array(
		'USD' => 1.0,
		'EUR' => 0.86,
		'GBP' => 0.74,
		'CHF' => 0.81,
		'AED' => AB_TAUX_AED_FIXE,
	);

	$response = wp_remote_get( 'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,CHF', array(
		'timeout' => 5,
	) );

	if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
		$corps = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( ! empty( $corps['rates'] ) && is_array( $corps['rates'] ) ) {
			foreach ( array( 'EUR', 'GBP', 'CHF' ) as $devise ) {
				if ( isset( $corps['rates'][ $devise ] ) ) {
					$taux[ $devise ] = (float) $corps['rates'][ $devise ];
				}
			}
		}
	}

	set_transient( 'ab_taux_change', $taux, DAY_IN_SECONDS );

	return $taux;
}
