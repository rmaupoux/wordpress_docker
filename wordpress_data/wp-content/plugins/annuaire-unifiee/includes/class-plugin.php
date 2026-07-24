<?php
/**
 * Classe principale du plugin Annuaire Unifié
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Annuaire_Unifiee {

	public function __construct() {
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/helpers.php';

		// Shortcodes
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/tabs.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/bateaux.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/maritime.php';

		// Endpoints REST
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/endpoints/bateaux.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/endpoints/maritime.php';

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Détermine si la page courante contient l'un des shortcodes du plugin
	 */
	private function page_utilise_shortcodes() {
		global $post;

		return $post && (
			has_shortcode( $post->post_content, 'annuaire_tabs' ) ||
			has_shortcode( $post->post_content, 'annuaire_bateaux_recherche' ) ||
			has_shortcode( $post->post_content, 'annuaire_recherche' )
		);
	}

	public function enqueue_assets() {
		if ( ! $this->page_utilise_shortcodes() ) {
			return;
		}

		wp_enqueue_style(
			'annuaire-unifiee-style',
			ANNUAIRE_UNIFIEE_URL . 'css/style.css',
			[],
			ANNUAIRE_UNIFIEE_VERSION
		);

		wp_enqueue_script(
			'annuaire-unifiee-script',
			ANNUAIRE_UNIFIEE_URL . 'js/script.js',
			[],
			ANNUAIRE_UNIFIEE_VERSION,
			true
		);

		wp_localize_script( 'annuaire-unifiee-script', 'AnnuaireUnifieeVars', [
			'bateaux'  => [
				'recherche' => esc_url_raw( rest_url( 'annuaire-bateau/v1/recherche' ) ),
				'types'     => esc_url_raw( rest_url( 'annuaire-bateau/v1/types' ) ),
				'filtrer'   => esc_url_raw( rest_url( 'annuaire-bateau/v1/filtrer' ) ),
			],
			'maritime' => [
				'recherche' => esc_url_raw( rest_url( 'annuaire/v1/recherche' ) ),
				'pays'      => esc_url_raw( rest_url( 'annuaire/v1/pays' ) ),
				'parPays'   => esc_url_raw( rest_url( 'annuaire/v1/par-pays' ) ),
				'types'     => esc_url_raw( rest_url( 'annuaire/v1/types' ) ),
				'parType'   => esc_url_raw( rest_url( 'annuaire/v1/par-type' ) ),
			],
		] );
	}
}
