<?php
/**
 * Constantes partagées du plugin Annuaire Unifié
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AB_CPT_NAME', 'annuaire_bateau' );
define( 'AB_TAXONOMIE_TYPE', 'type_de_bateau' );
define( 'AM_TAXONOMIE_TYPE', 'type_de_contact' );

/**
 * Slug de la page contenant [annuaire_bateaux_filtres_equipements], vers
 * laquelle le bouton "SEARCH YACHT" de [annuaire_bateaux_recherche] redirige
 * (avec les filtres Length/Year/Price en GET) au lieu de filtrer sur place —
 * voir js/script.js et js/equipements.js :: prefillDepuisURL.
 */
define( 'AB_SLUG_PAGE_FILTRES', 'boats-research' );

/**
 * URL de la page AB_SLUG_PAGE_FILTRES, résolue dynamiquement (plutôt que
 * codée en dur) pour rester correcte si son permalien change. Repli sur
 * home_url() si la page n'existe pas encore (ex. environnement local sans
 * cette page créée).
 */
function ab_get_url_page_filtres() {
	$page = get_page_by_path( AB_SLUG_PAGE_FILTRES );

	return $page ? get_permalink( $page ) : home_url( '/' . AB_SLUG_PAGE_FILTRES . '/' );
}

/**
 * Groupes de champs booléens Pods (_pods_group) sur le CPT annuaire_bateau,
 * affichés en checkboxes (cumulées en ET) dans le filtre
 * [annuaire_bateaux_filtres_equipements] : titre du groupe => [ slug (= meta_key,
 * valeur '1'/'0') => libellé affiché ]. Ordre et libellés repris de l'éditeur de
 * champs Pods (wp-admin). Certains slugs commencent par "_" (ex. "_ais") : ce
 * sont les meta_key réels en base, à conserver tels quels.
 */
define( 'AB_GROUPES_EQUIPEMENTS', array(
	'Technical equipements' => array(
		'shore_power_connection' => 'Shore power connection',
		'washing_machine'        => 'Washing machine',
		'generator'              => 'Generator',
		'dryer'                  => 'Dryer',
		'battery'                => 'Battery',
		'underwater_lights'      => 'Underwater lights',
		'battery_charger'        => 'Battery charger',
	),
	// NB : heater/refrigerator/ceramic_cooktop/freezer sont bien rattachés à ce
	// groupe côté Pods (post_id 2062), pas à "Kitchen" — configuration reprise
	// telle quelle depuis wp-admin, pas une erreur de recopie.
	'Nautical instruments' => array(
		'onboard_computer' => 'Onboard computer',
		'compass'          => 'Compass',
		'autopilot'        => 'Autopilot',
		'speed_regulator'  => 'Speed regulator',
		'fish_finder'      => 'Fish finder',
		'vhf_radio'        => 'VHF',
		'radar_reflector'  => 'Radar reflector',
		'chart_plotter'    => 'Chart plotter',
		'_anemometer'      => 'Anemometer',
		'depth_sounder'    => 'Depth sounder',
		'speedometer'      => 'Speedometer',
		'_ais'             => 'AIS',
		'epirb'            => 'EPIRB',
		'mob_system'       => 'MOB system',
		'heater'           => 'Heater',
		'refrigerator'     => 'Refrigerator',
		'ceramic_cooktop'  => 'Ceramic cooktop',
		'freezer'          => 'Freezer',
	),
	'Kitchen' => array(
		'stove'     => 'Stove',
		'microwave' => 'Microwave',
		'oven'      => 'Oven',
		'sink'      => 'Sink',
		'icebox'    => 'Icebox',
	),
	'Boat Accessories' => array(
		'bathing_ladder'            => 'Bathing ladder',
		'_integrated_swim_platform' => 'Integrated swim platform',
		'electric_swim_platform'    => 'Electric swim platform',
		'manual_swim_platform'      => 'Manual swim platform',
		'gangway'                   => 'Passerelle',
		'_electric_gangway'         => 'Electric gangway',
		'deck_shower'               => 'Deck shower',
		'heating'                   => 'Heating',
		'air_conditioning'          => 'Air conditioning',
		'ice_maker'                 => 'Ice maker',
		'television'                => 'Television',
		'mp3_player'                => 'MP3 player',
		'ipod_connection'           => 'iPod connection',
		'bluetooth_connector'       => 'Bluetooth connector',
		'dvb-t_antenna'             => 'DVB-T antenna',
		'satellite_antenna'         => 'Satellite antenna',
		'satellite_internet'        => 'Satellite internet',
		'cockpit_speakers'          => 'Cockpit speakers',
		'cockpit_table'             => 'Cockpit table',
		'minibar_with_sink'         => 'Minibar with sink',
		'_barbecue'                 => 'Barbecue',
		'radio'                     => 'Radio',
		'dvd_player'                => 'DVD player',
		'teak_deck'                 => 'Teak deck',
		'underwater_paint'          => 'Underwater paint',
		'boat_trailer'              => 'Boat trailer',
	),
) );

/**
 * Whitelist à plat (slug => libellé) dérivée de AB_GROUPES_EQUIPEMENTS + les 2
 * booléens du groupe "Plus de champs" (affichés à part, voir shortcode), utilisée
 * pour sanitizer le paramètre REST "equipements" (voir includes/endpoints/bateaux.php).
 */
define( 'AB_EQUIPEMENTS_TECHNIQUES', array_merge(
	array(
		'a_la_une' => 'Featured (à la une)',
		'vat'      => 'VAT Paid',
	),
	...array_values( AB_GROUPES_EQUIPEMENTS )
) );

/**
 * Champs texte Pods (type "text" en base) filtrés en LIKE, groupés par section
 * affichée dans la sidebar : titre => [ slug => libellé ]. Le champ "Model" du
 * groupe "Plus de champs" n'y figure pas : il réutilise le paramètre REST
 * historique "model" (voir ab_filtrer_bateaux), déjà branché sur son propre
 * champ de recherche. "Total power" (Engine) reste en texte plutôt qu'en plage
 * numérique comme "Engine hours" : ses valeurs réelles sont hétérogènes
 * ("2x300cv", "78.3kW"...), contrairement à "Engine hours", toujours un entier.
 */
define( 'AB_GROUPES_CHAMPS_TEXTE', array(
	'Plus de champs' => array(
		'town'    => 'Town',
		'builder' => 'Builder',
		'draft'   => 'Draft',
	),
	'Engine' => array(
		'make'        => 'Make',
		'model_'      => 'Model',
		'year_'       => 'Year',
		'total_power' => 'Total power',
		'fuel_type'   => 'Fuel Type',
	),
) );

define( 'AB_CHAMPS_TEXTE', array_merge( ...array_values( AB_GROUPES_CHAMPS_TEXTE ) ) );

/**
 * Whitelist des champs proposant l'autocomplétion à partir de 3 caractères sur
 * les valeurs déjà en base (voir /annuaire-bateau/v1/valeurs-champ et
 * js/equipements.js :: initAutocomplete) : AB_CHAMPS_TEXTE + "model", qui a son
 * propre paramètre REST dédié (voir ab_filtrer_bateaux) mais bénéficie de la
 * même autocomplétion.
 */
define( 'AB_CHAMPS_AUTOCOMPLETE', array_merge( AB_CHAMPS_TEXTE, array( 'model' => 'Model' ) ) );

/**
 * Champs numériques filtrés en plage min/max (BETWEEN), groupés par section :
 * titre => [ slug => libellé ]. "Length" et "Year" du groupe "Plus de champs"
 * n'y figurent pas : ils réutilisent les paramètres REST historiques
 * length_min/max et year_min/max, déjà branchés sur leurs propres champs dans
 * le formulaire de recherche principal.
 */
define( 'AB_GROUPES_CHAMPS_NUMERIQUES', array(
	'Plus de champs' => array(
		'cabins'        => 'Cabins',
		'gross_tonnage' => 'Gross tonnage',
		'capacity'      => 'Capacity',
		'bed'           => 'Bed',
		'shower_room'   => 'Shower room',
		'crew'          => 'Crew',
	),
	'Engine' => array(
		'engine_hours' => 'Engine hours',
	),
) );

define( 'AB_CHAMPS_NUMERIQUES', array_merge( ...array_values( AB_GROUPES_CHAMPS_NUMERIQUES ) ) );

/**
 * Champ Pods "pick" (relation) pays/Localisation du groupe "Plus de champs" :
 * stocké en code ISO-2 libre (valeurs réellement présentes en base : AE, CA,
 * ES, FR, GB, GP, GR, HR, IT, MC, MQ, US, +1 valeur non normalisée "Canada").
 * Affiché en dropdown alimenté dynamiquement par les valeurs distinctes
 * présentes (voir /annuaire-bateau/v1/pays), pas de correspondance code -> nom
 * de pays ici : même logique que le sélecteur de devise (code brut affiché).
 */
define( 'AB_CHAMP_PAYS_SLUG', 'pays' );
define( 'AB_CHAMP_PAYS_LABEL', 'Country' );
