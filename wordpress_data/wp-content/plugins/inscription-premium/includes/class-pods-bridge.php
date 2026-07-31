<?php
/**
 * Lecture/écriture des pods "annuaire_bateau" (annonce) et "annuaire_maritime"
 * (contact/vendeur) pour le compte du tunnel de dépôt d'annonce.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Pods_Bridge {

	/**
	 * Retourne l'ID du contact "annuaire_maritime" de l'utilisateur, en le
	 * créant s'il n'existe pas encore (user meta ip_contact_id).
	 *
	 * @param int   $user_id
	 * @param array $contact_data ['name' => '', 'email' => '', 'phone' => '']
	 * @return int|WP_Error
	 */
	public static function get_or_create_contact( $user_id, $contact_data = array() ) {
		$existing_contact_id = (int) get_user_meta( $user_id, 'ip_contact_id', true );

		if ( $existing_contact_id && get_post( $existing_contact_id ) ) {
			if ( ! empty( $contact_data ) ) {
				self::update_contact( $existing_contact_id, $contact_data );
			}

			return $existing_contact_id;
		}

		$user = get_userdata( $user_id );

		$name = ! empty( $contact_data['name'] ) ? $contact_data['name'] : $user->display_name;
		$name = '' !== trim( $name ) ? $name : $user->user_login;
		list( $first_name, $last_name ) = self::split_name( $name );

		$contact_pod = pods( IP_CONTACT_POD );

		// Le champ Pods "nom" (Last name) est requis au niveau du pod
		// annuaire_maritime : on doit donc lui fournir une valeur dès la
		// création, jamais après coup (voir split_name()).
		$params = array(
			'post_title'  => $name,
			'post_status' => 'publish',
			'prenom'      => $first_name,
			'nom'         => $last_name,
			'email'       => ! empty( $contact_data['email'] ) ? $contact_data['email'] : $user->user_email,
		);

		if ( ! empty( $contact_data['phone'] ) ) {
			$params['telephone'] = $contact_data['phone'];
		}

		try {
			$contact_id = $contact_pod->add( $params );
		} catch ( \Throwable $e ) {
			return new WP_Error( 'ip_contact_creation_failed', $e->getMessage() );
		}

		if ( ! $contact_id ) {
			return new WP_Error( 'ip_contact_creation_failed', __( 'Impossible de créer la fiche contact associée.', 'inscription-premium' ) );
		}

		update_user_meta( $user_id, 'ip_contact_id', $contact_id );

		return $contact_id;
	}

	private static function update_contact( $contact_id, $contact_data ) {
		$contact_pod = pods( IP_CONTACT_POD, $contact_id );
		$params      = array();

		if ( ! empty( $contact_data['name'] ) ) {
			list( $first_name, $last_name ) = self::split_name( $contact_data['name'] );
			$params['post_title'] = $contact_data['name'];
			$params['prenom']     = $first_name;
			$params['nom']        = $last_name;
		}

		if ( ! empty( $contact_data['email'] ) ) {
			$params['email'] = $contact_data['email'];
		}

		if ( ! empty( $contact_data['phone'] ) ) {
			$params['telephone'] = $contact_data['phone'];
		}

		if ( empty( $params ) ) {
			return;
		}

		try {
			$contact_pod->save( $params );
		} catch ( \Throwable $e ) {
			// Mise à jour non bloquante : on garde le contact existant tel quel.
		}
	}

	/**
	 * Découpe un nom complet en prénom/nom. Si un seul mot est fourni (pas
	 * d'espace), le même mot est utilisé pour les deux champs plutôt que de
	 * laisser "nom" vide — ce champ Pods est marqué requis sur le pod
	 * annuaire_maritime et refuse une valeur vide.
	 */
	private static function split_name( $full_name ) {
		$full_name = trim( $full_name );
		$parts     = preg_split( '/\s+/', $full_name, 2 );

		$first_name = $parts[0] ?? $full_name;
		$last_name  = ! empty( $parts[1] ) ? $parts[1] : $first_name;

		return array( $first_name, $last_name );
	}

	/**
	 * Crée (ou met à jour) le post Pods "annuaire_bateau" en brouillon à
	 * partir des données collectées dans le draft du tunnel.
	 *
	 * @param int        $user_id
	 * @param array      $draft   Données du draft (voir IP_Tunnel::get_draft()).
	 * @param int|null   $post_id Post existant à mettre à jour, sinon création.
	 * @return int|WP_Error
	 */
	public static function save_draft_listing( $user_id, array $draft, $post_id = null ) {
		$boat_pod = $post_id ? pods( IP_BOAT_POD, $post_id ) : pods( IP_BOAT_POD );

		$title = ! empty( $draft['general']['model'] ) ? sanitize_text_field( $draft['general']['model'] ) : __( 'Annonce sans titre', 'inscription-premium' );

		$params = array(
			'post_title'  => $title,
			'post_status' => 'draft',
			'post_author' => $user_id,
		);

		if ( $post_id ) {
			$params['ID'] = $post_id;
		}

		$saved_id = $boat_pod->save( $params );

		if ( ! $saved_id ) {
			return new WP_Error( 'ip_listing_save_failed', __( 'Impossible d\'enregistrer le brouillon d\'annonce.', 'inscription-premium' ) );
		}

		$boat_pod = pods( IP_BOAT_POD, $saved_id );

		foreach ( array( 'general', 'engine', 'layout', 'price' ) as $section ) {
			if ( empty( $draft[ $section ] ) || ! is_array( $draft[ $section ] ) ) {
				continue;
			}

			$field_map = 'price' === $section ? ip_boat_field_map()['price'] : ip_boat_field_map()[ $section ];

			foreach ( $draft[ $section ] as $key => $value ) {
				if ( ! isset( $field_map[ $key ] ) ) {
					continue;
				}

				self::save_field_by_type( $boat_pod, $field_map[ $key ], $value );
			}
		}

		if ( ! empty( $draft['type'] ) ) {
			wp_set_post_terms( $saved_id, array( (int) $draft['type'] ), IP_BOAT_TAXONOMY, false );
		}

		if ( ! empty( $draft['contact_id'] ) ) {
			$boat_pod->save( ip_boat_contact_field(), (int) $draft['contact_id'] );
		}

		update_post_meta( $saved_id, 'ip_owner_user_id', $user_id );

		return $saved_id;
	}

	private static function save_field_by_type( $boat_pod, $field_config, $value ) {
		$pods_field = $field_config['pods_field'];

		switch ( $field_config['type'] ) {
			case 'boolean':
				$boat_pod->save( $pods_field, ! empty( $value ) ? 1 : 0 );
				break;

			case 'number':
			case 'currency':
				$boat_pod->save( $pods_field, is_numeric( $value ) ? $value : 0 );
				break;

			case 'pick_country':
			case 'text':
			case 'date':
			default:
				$boat_pod->save( $pods_field, sanitize_text_field( (string) $value ) );
				break;
		}
	}

	/**
	 * Associe des IDs d'attachments médiathèque au champ galerie photos.
	 *
	 * @param int   $post_id
	 * @param int[] $attachment_ids
	 */
	public static function save_photos( $post_id, array $attachment_ids ) {
		$boat_pod = pods( IP_BOAT_POD, $post_id );
		$boat_pod->save( ip_boat_photos_field(), $attachment_ids );

		if ( ! empty( $attachment_ids ) ) {
			set_post_thumbnail( $post_id, $attachment_ids[0] );
		}
	}

	/**
	 * Passe l'annonce en "publish" et enregistre sa date d'expiration.
	 *
	 * @param int $post_id
	 * @param int $duration_days
	 */
	public static function publish_listing( $post_id, $duration_days ) {
		wp_update_post( array( 'ID' => $post_id, 'post_status' => 'publish' ) );

		$expiry = gmdate( 'Y-m-d', strtotime( "+{$duration_days} days" ) );

		$boat_pod = pods( IP_BOAT_POD, $post_id );
		$boat_pod->save( ip_boat_expiry_field(), $expiry );

		update_post_meta( $post_id, 'ip_listing_expiry_timestamp', strtotime( $expiry ) );
	}

	/**
	 * Récapitulatif utilisé à l'étape 4 (photo, titre, prix, localisation).
	 */
	public static function get_listing_summary( $post_id ) {
		$boat_pod = pods( IP_BOAT_POD, $post_id );

		$photos    = (array) $boat_pod->field( ip_boat_photos_field() );
		$cover_url = '';

		if ( ! empty( $photos[0]['guid'] ) ) {
			$cover_url = $photos[0]['guid'];
		} elseif ( ! empty( $photos[0]['ID'] ) ) {
			$cover_url = wp_get_attachment_url( $photos[0]['ID'] );
		}

		return array(
			'title'        => get_the_title( $post_id ),
			'price'        => $boat_pod->field( 'asking_price' ),
			'localisation' => $boat_pod->field( 'town' ),
			'cover_url'    => $cover_url,
		);
	}
}
