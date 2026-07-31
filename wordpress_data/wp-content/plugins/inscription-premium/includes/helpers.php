<?php
/**
 * Fonctions utilitaires partagées.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Liste de pays utilisée pour le champ Pods "pays" (pick_object country) du
 * pod annuaire_bateau, qui stocke le nom du pays tel quel. Filtrable pour
 * ajouter/retirer des pays sans toucher au code.
 *
 * @return string[]
 */
function ip_get_country_list() {
	static $countries = null;

	if ( null !== $countries ) {
		return $countries;
	}

	$countries = apply_filters( 'inscription_premium_country_list', array(
		'France', 'Monaco', 'Italy', 'Spain', 'Greece', 'Croatia', 'Malta', 'Montenegro',
		'Portugal', 'Turkey', 'Cyprus', 'United Kingdom', 'Ireland', 'Germany', 'Netherlands',
		'Belgium', 'Luxembourg', 'Switzerland', 'Austria', 'Norway', 'Sweden', 'Denmark',
		'Finland', 'Poland', 'Slovenia', 'Albania', 'United States', 'Canada', 'Mexico',
		'Bahamas', 'Bermuda', 'British Virgin Islands', 'United States Virgin Islands',
		'Antigua and Barbuda', 'Saint Martin', 'Saint Barthélemy', 'Puerto Rico', 'Cuba',
		'Dominican Republic', 'Panama', 'Costa Rica', 'Brazil', 'Argentina', 'Chile',
		'United Arab Emirates', 'Qatar', 'Saudi Arabia', 'Morocco', 'Tunisia', 'Egypt',
		'South Africa', 'Seychelles', 'Mauritius', 'Maldives', 'Thailand', 'Indonesia',
		'Malaysia', 'Singapore', 'Philippines', 'Vietnam', 'Japan', 'China', 'Hong Kong',
		'South Korea', 'Australia', 'New Zealand', 'Fiji',
	) );

	sort( $countries );

	return $countries;
}

/**
 * Formatage prix (utilisé dans les templates du tunnel et l'admin).
 */
function ip_format_price( $amount, $currency_symbol = '€' ) {
	return number_format_i18n( (float) $amount, 2 ) . ' ' . $currency_symbol;
}
