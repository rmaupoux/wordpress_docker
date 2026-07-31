<?php
/**
 * Paiement : interface de gateway abstraite + implémentation Stripe
 * (Checkout Session, appels HTTP directs à l'API Stripe — pas de SDK requis).
 * Webhook Stripe déclaré ici via rest_api_init, pour ne jamais publier
 * l'annonce sur un simple retour navigateur.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

interface IP_Payment_Gateway {

	/**
	 * @param array $args ['amount' => float, 'currency' => string, 'description' => string,
	 *                      'success_url' => string, 'cancel_url' => string, 'metadata' => array]
	 * @return array{url:string,id:string}|WP_Error
	 */
	public function create_checkout_session( array $args );

	/**
	 * Vérifie la signature de la requête webhook et retourne l'évènement
	 * normalisé, ou WP_Error si invalide.
	 *
	 * @return array{type:string,metadata:array}|WP_Error
	 */
	public function verify_and_parse_webhook( WP_REST_Request $request );

	public function is_configured();
}

class IP_Stripe_Gateway implements IP_Payment_Gateway {

	const API_BASE = 'https://api.stripe.com/v1';

	private function secret_key() {
		return get_option( 'ip_stripe_secret_key', '' );
	}

	private function webhook_secret() {
		return get_option( 'ip_stripe_webhook_secret', '' );
	}

	public function is_configured() {
		return (bool) $this->secret_key();
	}

	public function create_checkout_session( array $args ) {
		if ( ! $this->is_configured() ) {
			return new WP_Error( 'ip_stripe_not_configured', __( 'Clé secrète Stripe manquante.', 'inscription-premium' ) );
		}

		$body = array(
			'mode'                              => 'payment',
			'success_url'                       => $args['success_url'],
			'cancel_url'                         => $args['cancel_url'],
			'line_items'                         => array(
				array(
					'quantity'   => 1,
					'price_data' => array(
						'currency'     => $args['currency'],
						'unit_amount'  => (int) round( $args['amount'] * 100 ),
						'product_data' => array(
							'name' => $args['description'],
						),
					),
				),
			),
		);

		foreach ( $args['metadata'] as $key => $value ) {
			$body['metadata'][ $key ] = (string) $value;
		}

		$response = wp_remote_post( self::API_BASE . '/checkout/sessions', array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $this->secret_key(),
			),
			'body'    => $this->to_stripe_form_body( $body ),
			'timeout' => 20,
		) );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$data = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( empty( $data['url'] ) ) {
			return new WP_Error( 'ip_stripe_session_failed', $data['error']['message'] ?? __( 'Création de la session Stripe impossible.', 'inscription-premium' ) );
		}

		return array( 'url' => $data['url'], 'id' => $data['id'] );
	}

	/**
	 * Stripe attend un encodage "application/x-www-form-urlencoded" avec des
	 * clés en notation crochets pour les tableaux imbriqués (line_items[0][...]).
	 */
	private function to_stripe_form_body( array $data, $prefix = '' ) {
		$pairs = array();

		foreach ( $data as $key => $value ) {
			$form_key = $prefix ? "{$prefix}[{$key}]" : $key;

			if ( is_array( $value ) ) {
				$pairs = array_merge( $pairs, $this->to_stripe_form_body( $value, $form_key ) );
			} else {
				$pairs[ $form_key ] = $value;
			}
		}

		return $pairs;
	}

	public function verify_and_parse_webhook( WP_REST_Request $request ) {
		$payload   = $request->get_body();
		$sig_header = $request->get_header( 'stripe-signature' );
		$secret     = $this->webhook_secret();

		if ( ! $secret || ! $sig_header ) {
			return new WP_Error( 'ip_stripe_webhook_unconfigured', __( 'Webhook Stripe non configuré.', 'inscription-premium' ) );
		}

		$parts = array();

		foreach ( explode( ',', $sig_header ) as $part ) {
			$kv = explode( '=', $part, 2 );

			if ( 2 === count( $kv ) ) {
				$parts[ $kv[0] ] = $kv[1];
			}
		}

		if ( empty( $parts['t'] ) || empty( $parts['v1'] ) ) {
			return new WP_Error( 'ip_stripe_invalid_signature', __( 'Signature Stripe invalide.', 'inscription-premium' ) );
		}

		$signed_payload      = $parts['t'] . '.' . $payload;
		$expected_signature  = hash_hmac( 'sha256', $signed_payload, $secret );

		if ( ! hash_equals( $expected_signature, $parts['v1'] ) ) {
			return new WP_Error( 'ip_stripe_invalid_signature', __( 'Signature Stripe invalide.', 'inscription-premium' ) );
		}

		$event = json_decode( $payload, true );

		if ( empty( $event['type'] ) ) {
			return new WP_Error( 'ip_stripe_invalid_payload', __( 'Payload Stripe invalide.', 'inscription-premium' ) );
		}

		$metadata = $event['data']['object']['metadata'] ?? array();

		return array( 'type' => $event['type'], 'metadata' => $metadata );
	}
}

class IP_Payment {

	private static $instance = null;
	private $gateway;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		$this->gateway = apply_filters( 'inscription_premium_payment_gateway', new IP_Stripe_Gateway() );

		add_action( 'rest_api_init', array( $this, 'register_webhook_route' ) );
	}

	public function register_webhook_route() {
		register_rest_route( 'inscription-premium/v1', '/stripe-webhook', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'handle_webhook' ),
			'permission_callback' => '__return_true',
		) );
	}

	public static function get_gateway() {
		return self::instance()->gateway;
	}

	public static function is_configured() {
		return self::get_gateway()->is_configured();
	}

	/**
	 * @return array<int,array{price:float,recommended:bool}>
	 */
	public static function get_duration_options() {
		$recommended = (int) get_option( 'ip_duration_recommended', 60 );

		return array(
			30 => array( 'price' => (float) get_option( 'ip_duration_30_price', 29 ), 'recommended' => 30 === $recommended ),
			60 => array( 'price' => (float) get_option( 'ip_duration_60_price', 49 ), 'recommended' => 60 === $recommended ),
			90 => array( 'price' => (float) get_option( 'ip_duration_90_price', 69 ), 'recommended' => 90 === $recommended ),
		);
	}

	public static function calculate_total( array $draft ) {
		$durations = self::get_duration_options();
		$days      = (int) ( $draft['duration_days'] ?? 0 );
		$total     = isset( $durations[ $days ] ) ? $durations[ $days ]['price'] : 0;

		if ( ! empty( $draft['addons']['highlights'] ) ) {
			$total += (float) get_option( 'ip_highlights_price', 15 );
		}

		return $total;
	}

	/**
	 * Crée la session de paiement pour le draft courant de l'utilisateur.
	 * Si le total à payer est nul (durée gratuite / option de test), l'annonce
	 * est publiée immédiatement sans passer par Stripe.
	 *
	 * @return array{url:string}|array{free:true,redirect:string}|WP_Error
	 */
	public static function start_checkout( $user_id, array $draft, $success_url, $cancel_url ) {
		$total = self::calculate_total( $draft );

		if ( $total <= 0 ) {
			self::finalize_listing_payment(
				$user_id,
				(int) $draft['listing_id'],
				(int) $draft['duration_days'],
				0,
				'free',
				__( 'Annonce publiée gratuitement (durée à tarif nul)', 'inscription-premium' )
			);

			return array( 'free' => true, 'redirect' => $success_url );
		}

		return self::get_gateway()->create_checkout_session( array(
			'amount'      => $total,
			'currency'    => 'eur',
			'description' => sprintf( __( 'Publication annonce #%d (%d jours)', 'inscription-premium' ), (int) $draft['listing_id'], (int) $draft['duration_days'] ),
			'success_url' => $success_url,
			'cancel_url'  => $cancel_url,
			'metadata'    => array(
				'ip_user_id'        => $user_id,
				'ip_listing_id'     => (int) $draft['listing_id'],
				'ip_duration_days'  => (int) $draft['duration_days'],
				'ip_highlights'     => ! empty( $draft['addons']['highlights'] ) ? '1' : '0',
			),
		) );
	}

	/**
	 * Callback du endpoint /stripe-webhook. Ne publie l'annonce qu'après
	 * vérification serveur-à-serveur de la signature Stripe.
	 */
	public function handle_webhook( WP_REST_Request $request ) {
		$event = $this->gateway->verify_and_parse_webhook( $request );

		if ( is_wp_error( $event ) ) {
			return new WP_REST_Response( array( 'error' => $event->get_error_message() ), 400 );
		}

		if ( 'checkout.session.completed' !== $event['type'] ) {
			return new WP_REST_Response( array( 'ignored' => true ), 200 );
		}

		$metadata   = $event['metadata'];
		$user_id    = (int) ( $metadata['ip_user_id'] ?? 0 );
		$listing_id = (int) ( $metadata['ip_listing_id'] ?? 0 );
		$duration   = (int) ( $metadata['ip_duration_days'] ?? 0 );

		if ( ! $user_id || ! $listing_id || ! $duration ) {
			return new WP_REST_Response( array( 'error' => 'missing_metadata' ), 400 );
		}

		$amount = self::calculate_total( array(
			'duration_days' => $duration,
			'addons'        => array( 'highlights' => '1' === ( $metadata['ip_highlights'] ?? '0' ) ),
		) );

		self::finalize_listing_payment( $user_id, $listing_id, $duration, $amount, 'stripe', sprintf( 'Annonce #%d publiée', $listing_id ) );

		return new WP_REST_Response( array( 'success' => true ), 200 );
	}

	/**
	 * Publie l'annonce, journalise le paiement et vide le draft. Point
	 * d'entrée commun au webhook Stripe et au court-circuit "montant nul"
	 * de start_checkout(), pour ne jamais dupliquer la logique de
	 * publication entre les deux chemins.
	 */
	private static function finalize_listing_payment( $user_id, $listing_id, $duration, $amount, $payment_method, $note ) {
		IP_Pods_Bridge::publish_listing( $listing_id, $duration );

		IP_Subscription_History::log( $user_id, 'listing_payment', $amount, $payment_method, $note );

		IP_Tunnel::clear_draft( $user_id );

		do_action( 'inscription_premium_listing_published', $listing_id, $user_id );
	}
}
