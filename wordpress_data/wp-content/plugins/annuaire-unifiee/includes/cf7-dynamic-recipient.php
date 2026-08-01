<?php
/**
 * Destinataire dynamique pour le formulaire de contact bateau (Contact Form 7)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Rendu du formulaire de contact bateau, appelé comme "helper" depuis le
 * Pods Template via le magic tag {@ID,annuaire_bateau_render_cf7_form}.
 *
 * Les Pods Templates ne passent pas leur sortie dans do_shortcode(), donc le
 * shortcode [contact-form-7] écrit directement dans le template ne serait
 * jamais traité : on passe par un helper Pods (simple fonction PHP globale)
 * qui appelle do_shortcode() lui-même.
 */
function annuaire_bateau_render_cf7_form() {
	return do_shortcode( '[contact-form-7 id="1890" title="Bateau - Formulaire de contact"]' );
}

// Pods n'autorise par défaut que esc_attr/esc_html comme helpers de magic tag ;
// on autorise explicitement ce seul helper (pas d'ouverture générale des callbacks).
add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_render_cf7_form';

	return $allowed;
} );

add_filter( 'wpcf7_form_hidden_fields', function ( $fields ) {
	$post_id = get_the_ID();

	if ( ! $post_id || 'annuaire_bateau' !== get_post_type( $post_id ) ) {
		return $fields;
	}

	$bateau = pods( 'annuaire_bateau', $post_id );

	$fields['recipient_email'] = $bateau->field( 'contact_assoc.email' ) ?: get_option( 'admin_email' );
	$fields['boat_model']      = $bateau->field( 'model' );
	$fields['boat_url']        = get_permalink( $post_id );

	return $fields;
} );

/**
 * Rendu du formulaire de contact de la fiche annuaire maritime (Contact Form 7),
 * appelé comme helper depuis le Pods Template via {@ID,annuaire_maritime_render_cf7_form}.
 *
 * Le destinataire est fixe (maupouxmarius@gmail.com, voir le formulaire CF7
 * #2059), contrairement au formulaire bateau dont le destinataire est
 * dynamique.
 */
function annuaire_maritime_render_cf7_form() {
	return do_shortcode( '[contact-form-7 id="2059" title="Annuaire maritime - Formulaire de contact"]' );
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_maritime_render_cf7_form';

	return $allowed;
} );

/**
 * Ajoute au formulaire de contact de la fiche annuaire maritime des champs
 * cachés permettant d'identifier, dans le mail envoyé à
 * maupouxmarius@gmail.com, sur quelle fiche (nom + URL) le message a été
 * envoyé ainsi que l'adresse email de la personne affichée sur cette fiche.
 */
add_filter( 'wpcf7_form_hidden_fields', function ( $fields ) {
	$post_id = get_the_ID();

	if ( ! $post_id || 'annuaire_maritime' !== get_post_type( $post_id ) ) {
		return $fields;
	}

	$contact = pods( 'annuaire_maritime', $post_id );

	$fields['maritime_contact_name']  = trim( $contact->field( 'prenom' ) . ' ' . $contact->field( 'nom' ) );
	$fields['maritime_contact_url']   = get_permalink( $post_id );
	$fields['maritime_contact_email'] = $contact->field( 'email' );

	return $fields;
} );

/**
 * En local (Docker sans accès internet sortant), la vérification serveur du
 * reCAPTCHA global de CF7 échoue systématiquement (impossible de joindre
 * l'API Google), ce qui marque à tort tous les envois comme spam.
 *
 * On ne désactive le reCAPTCHA pour ce formulaire QUE dans cet environnement
 * local (même garde-fou que Mailpit via SMTP_HOST) : en production le
 * reCAPTCHA reste actif comme pour les autres formulaires du site.
 */
if ( getenv( 'SMTP_HOST' ) ) {
	add_filter( 'wpcf7_spam', function ( $spam, $submission ) {
		if ( 2120 === $submission->get_contact_form()->id() ) {
			return false;
		}

		return $spam;
	}, 20, 2 );
}
