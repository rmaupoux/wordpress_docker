<?php
/**
 * Association entre les clés logiques utilisées par le tunnel et les
 * véritables noms de champs Pods (pod "annuaire_bateau" pour l'annonce,
 * pod "annuaire_maritime" pour la fiche contact du vendeur).
 *
 * Fichier volontairement simple (tableaux PHP) pour rester éditable
 * facilement si les champs Pods sont renommés ou réorganisés côté admin.
 *
 * Les clés 'draft', 'gross_tonnage', 'capacity', 'bed' et 'shower_room'
 * sont créées automatiquement à l'activation du plugin si elles n'existent
 * pas encore dans Pods (voir includes/class-activator.php).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @return array{
 *     general: array<string,array>,
 *     engine: array<string,array>,
 *     layout: array<string,array>,
 *     price: array<string,array>,
 * }
 */
function ip_boat_field_map() {
	return apply_filters( 'inscription_premium_boat_field_map', array(
		'general' => array(
			'model'         => array( 'pods_field' => 'model', 'label' => __( 'Model', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
			'localisation'  => array( 'pods_field' => 'pays', 'label' => __( 'Localisation', 'inscription-premium' ), 'type' => 'pick_country', 'required' => false ),
			'town'          => array( 'pods_field' => 'town', 'label' => __( 'Town', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
			'year'          => array( 'pods_field' => 'year', 'label' => __( 'Year', 'inscription-premium' ), 'type' => 'date', 'required' => false ),
			'builder'       => array( 'pods_field' => 'builder', 'label' => __( 'Builder', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
			'length_ft'     => array( 'pods_field' => 'lenght_ft', 'label' => __( 'Length FT', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
			'draft'         => array( 'pods_field' => 'draft', 'label' => __( 'Draft', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
			'gross_tonnage' => array( 'pods_field' => 'gross_tonnage', 'label' => __( 'Gross tonnage', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
			'capacity'      => array( 'pods_field' => 'capacity', 'label' => __( 'Number of people allowed on board', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
		),
		'engine'  => array(
			'engine'       => array( 'pods_field' => 'make', 'label' => __( 'Moteur', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
			'fuel'         => array( 'pods_field' => 'fuel_type', 'label' => __( 'Carburant', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
			'engine_hours' => array( 'pods_field' => 'engine_hours_', 'label' => __( 'Engine hours', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
		),
		'layout'  => array(
			'cabins'      => array( 'pods_field' => 'cabins', 'label' => __( 'Cabins', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
			'bed'         => array( 'pods_field' => 'bed', 'label' => __( 'Bed', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
			'shower_room' => array( 'pods_field' => 'shower_room', 'label' => __( 'Shower room', 'inscription-premium' ), 'type' => 'number', 'required' => false ),
		),
		'price'   => array(
			'price'    => array( 'pods_field' => 'asking_price', 'label' => __( 'Price', 'inscription-premium' ), 'type' => 'currency', 'required' => false ),
			'vat_paid' => array( 'pods_field' => 'vat', 'label' => __( 'VAT paid', 'inscription-premium' ), 'type' => 'boolean', 'required' => false ),
		),
	) );
}

/**
 * Champ Pods (galerie multi-fichiers) utilisé pour les photos de l'annonce.
 */
function ip_boat_photos_field() {
	return apply_filters( 'inscription_premium_boat_photos_field', 'photo_galerie' );
}

/**
 * Champ Pods de relation utilisé pour lier une annonce à son contact vendeur.
 */
function ip_boat_contact_field() {
	return apply_filters( 'inscription_premium_boat_contact_field', 'contact_assoc' );
}

/**
 * Champ Pods utilisé pour la date d'expiration de l'annonce (durée de
 * publication choisie à l'étape 4). Créé par le plugin s'il n'existe pas.
 */
function ip_boat_expiry_field() {
	return apply_filters( 'inscription_premium_boat_expiry_field', 'ip_listing_expiry' );
}

/**
 * Mapping du formulaire "Contact informations" (étape 2) vers le pod contact
 * "annuaire_maritime". Le champ "Name" du tunnel est scindé en prénom/nom.
 */
function ip_contact_field_map() {
	return apply_filters( 'inscription_premium_contact_field_map', array(
		'email' => array( 'pods_field' => 'email', 'label' => __( 'Mail', 'inscription-premium' ), 'type' => 'email', 'required' => false ),
		'phone' => array( 'pods_field' => 'telephone', 'label' => __( 'Phone number', 'inscription-premium' ), 'type' => 'text', 'required' => false ),
	) );
}
