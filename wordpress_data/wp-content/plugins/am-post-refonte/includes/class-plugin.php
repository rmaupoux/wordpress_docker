<?php
/**
 * Classe principale du plugin AM Post Refonte
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AM_Post_Refonte {

	public function __construct() {
		require_once AM_POST_REFONTE_PATH . 'includes/shortcodes/activities.php';

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Archive de catégorie "Activities", d'une de ses sous-catégories, ou de
	 * toute catégorie disposant de son propre template FSE
	 * category-{slug}.html stylé via les classes .am-activities-*
	 * (ex: /category/world-luxury-events/, voir includes/shortcodes/activities.php).
	 *
	 * On détecte aussi la présence du template dédié plutôt que de se fier
	 * uniquement à la hiérarchie des catégories : une catégorie comme
	 * "World luxury events" doit garder son style même si elle n'est plus
	 * rattachée à "Activities" comme catégorie parente.
	 */
	private function page_est_archive_activities() {
		if ( ! is_category() ) {
			return false;
		}

		$terme = get_queried_object();
		if ( ! ( $terme instanceof WP_Term ) ) {
			return false;
		}
		if ( $terme->slug === 'activities' ) {
			return true;
		}

		if ( file_exists( get_stylesheet_directory() . '/templates/category-' . $terme->slug . '.html' ) ) {
			return true;
		}

		foreach ( get_ancestors( $terme->term_id, $terme->taxonomy ) as $ancetre_id ) {
			$ancetre = get_term( $ancetre_id, $terme->taxonomy );
			if ( $ancetre && ! is_wp_error( $ancetre ) && $ancetre->slug === 'activities' ) {
				return true;
			}
		}

		return false;
	}

	public function enqueue_assets() {
		if ( ! $this->page_est_archive_activities() ) {
			return;
		}

		wp_enqueue_style(
			'am-post-refonte-style',
			AM_POST_REFONTE_URL . 'css/style.css',
			[],
			AM_POST_REFONTE_VERSION
		);
	}
}
