<?php
/**
 * Endpoints REST du tunnel (sauvegarde AJAX de chaque étape).
 * Toutes les routes exigent un utilisateur connecté (le nonce `wp_rest`
 * est vérifié nativement par WordPress via l'en-tête X-WP-Nonce).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_REST_API {

	const NS = 'inscription-premium/v1';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route( self::NS, '/tunnel/step/1', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'save_step_1' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/2', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'save_step_2' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/3/upload', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'upload_photo' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/3/remove', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'remove_photo' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/3/finish', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'finish_step_3' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/4', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'save_step_4' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );

		register_rest_route( self::NS, '/tunnel/step/5/checkout', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'start_checkout' ),
			'permission_callback' => array( $this, 'require_login_and_subscription' ),
		) );
	}

	public function require_login_and_subscription() {
		if ( ! is_user_logged_in() ) {
			return new WP_Error( 'ip_not_logged_in', __( 'Vous devez être connecté.', 'inscription-premium' ), array( 'status' => 401 ) );
		}

		if ( ! IP_Subscription::can_access_tunnel( get_current_user_id() ) ) {
			return new WP_Error( 'ip_subscription_required', __( 'Un abonnement actif est requis.', 'inscription-premium' ), array( 'status' => 403 ) );
		}

		return true;
	}

	public function save_step_1( WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$term_id = (int) $request->get_param( 'type' );

		if ( ! $term_id || ! term_exists( $term_id, IP_BOAT_TAXONOMY ) ) {
			return new WP_Error( 'ip_invalid_type', __( 'Type de bien invalide.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$draft         = IP_Tunnel::get_draft( $user_id );
		$draft['type'] = $term_id;
		IP_Tunnel::save_draft( $user_id, $draft );

		return rest_ensure_response( array( 'next' => IP_Tunnel::get_step_url( 2 ) ) );
	}

	public function save_step_2( WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$draft   = IP_Tunnel::get_draft( $user_id );

		if ( empty( $draft['type'] ) ) {
			return new WP_Error( 'ip_missing_type', __( 'Merci de choisir un type de bien d\'abord.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$sections = array( 'general', 'engine', 'layout', 'price' );
		$boat_map = ip_boat_field_map();

		foreach ( $sections as $section ) {
			$input = (array) $request->get_param( $section );
			$clean = array();

			foreach ( $boat_map[ $section ] as $key => $config ) {
				$value = $input[ $key ] ?? '';

				if ( $config['required'] && '' === trim( (string) $value ) ) {
					return new WP_Error( 'ip_missing_field', sprintf( __( 'Le champ "%s" est requis.', 'inscription-premium' ), $config['label'] ), array( 'status' => 400 ) );
				}

				$clean[ $key ] = is_scalar( $value ) ? sanitize_text_field( (string) $value ) : '';
			}

			$draft[ $section ] = $clean;
		}

		$contact_input = (array) $request->get_param( 'contact' );
		$contact       = array(
			'name'  => sanitize_text_field( $contact_input['name'] ?? '' ),
			'email' => sanitize_email( $contact_input['email'] ?? '' ),
			'phone' => sanitize_text_field( $contact_input['phone'] ?? '' ),
		);

		if ( '' !== $contact['email'] && ! is_email( $contact['email'] ) ) {
			return new WP_Error( 'ip_invalid_contact_email', __( 'L\'adresse email de contact n\'est pas valide.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$draft['contact'] = $contact;

		IP_Tunnel::save_draft( $user_id, $draft );

		return rest_ensure_response( array( 'next' => IP_Tunnel::get_step_url( 3 ) ) );
	}

	public function upload_photo( WP_REST_Request $request ) {
		if ( empty( $_FILES['file'] ) ) {
			return new WP_Error( 'ip_no_file', __( 'Aucun fichier reçu.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$file = $_FILES['file'];

		$allowed_types = array( 'image/jpeg', 'image/png', 'image/webp' );
		$max_size      = (int) apply_filters( 'inscription_premium_max_photo_size', 8 * MB_IN_BYTES );

		if ( ! in_array( $file['type'], $allowed_types, true ) ) {
			return new WP_Error( 'ip_invalid_type', __( 'Formats acceptés : JPG, PNG, WEBP.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		if ( $file['size'] > $max_size ) {
			return new WP_Error( 'ip_file_too_large', __( 'Fichier trop volumineux.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$attachment_id = media_handle_upload( 'file', 0 );

		if ( is_wp_error( $attachment_id ) ) {
			return $attachment_id;
		}

		$user_id           = get_current_user_id();
		$draft              = IP_Tunnel::get_draft( $user_id );
		$draft['photo_ids'][] = $attachment_id;
		IP_Tunnel::save_draft( $user_id, $draft );

		return rest_ensure_response( array(
			'id'  => $attachment_id,
			'url' => wp_get_attachment_image_url( $attachment_id, 'thumbnail' ),
		) );
	}

	public function remove_photo( WP_REST_Request $request ) {
		$attachment_id = (int) $request->get_param( 'id' );
		$user_id       = get_current_user_id();
		$draft         = IP_Tunnel::get_draft( $user_id );

		$draft['photo_ids'] = array_values( array_diff( $draft['photo_ids'], array( $attachment_id ) ) );
		IP_Tunnel::save_draft( $user_id, $draft );

		if ( (int) get_post_field( 'post_author', $attachment_id ) === $user_id ) {
			wp_delete_attachment( $attachment_id, true );
		}

		return rest_ensure_response( array( 'photo_ids' => $draft['photo_ids'] ) );
	}

	public function finish_step_3( WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$draft   = IP_Tunnel::get_draft( $user_id );

		if ( count( $draft['photo_ids'] ) < 3 ) {
			return new WP_Error( 'ip_not_enough_photos', __( 'Au moins 3 photos sont requises.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$contact_id = IP_Pods_Bridge::get_or_create_contact( $user_id, $draft['contact'] );

		if ( is_wp_error( $contact_id ) ) {
			return $contact_id;
		}

		$draft['contact_id'] = $contact_id;

		$listing_id = IP_Pods_Bridge::save_draft_listing( $user_id, $draft, $draft['listing_id'] ?: null );

		if ( is_wp_error( $listing_id ) ) {
			return $listing_id;
		}

		IP_Pods_Bridge::save_photos( $listing_id, $draft['photo_ids'] );

		$draft['listing_id'] = $listing_id;
		IP_Tunnel::save_draft( $user_id, $draft );

		return rest_ensure_response( array( 'next' => IP_Tunnel::get_step_url( 4 ) ) );
	}

	public function save_step_4( WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$draft   = IP_Tunnel::get_draft( $user_id );

		if ( empty( $draft['listing_id'] ) || (int) get_post_field( 'post_author', $draft['listing_id'] ) !== $user_id ) {
			return new WP_Error( 'ip_invalid_listing', __( 'Annonce introuvable.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$duration_days = (int) $request->get_param( 'duration_days' );
		$valid_days    = array_keys( IP_Payment::get_duration_options() );

		if ( ! in_array( $duration_days, $valid_days, true ) ) {
			return new WP_Error( 'ip_invalid_duration', __( 'Durée invalide.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$draft['duration_days']         = $duration_days;
		$draft['addons']['highlights']  = $request->get_param( 'addon_highlights' ) ? true : false;

		IP_Tunnel::save_draft( $user_id, $draft );

		return rest_ensure_response( array( 'next' => IP_Tunnel::get_step_url( 5 ) ) );
	}

	public function start_checkout( WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$draft   = IP_Tunnel::get_draft( $user_id );

		if ( empty( $draft['listing_id'] ) || empty( $draft['duration_days'] ) ) {
			return new WP_Error( 'ip_incomplete_draft', __( 'Le parcours n\'est pas complet.', 'inscription-premium' ), array( 'status' => 400 ) );
		}

		$step5_url = IP_Tunnel::get_step_url( 5 );

		$result = IP_Payment::start_checkout(
			$user_id,
			$draft,
			add_query_arg( 'ip_payment', 'success', $step5_url ),
			add_query_arg( 'ip_payment', 'cancelled', $step5_url )
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( $result );
	}
}
