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
		require_once AM_POST_REFONTE_PATH . 'includes/shortcodes/home.php';

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Les archives de catégorie et de tag utilisent le même gabarit
	 * am-activities-* (voir templates FSE "All Archives" / "Tag Archives"
	 * et includes/shortcodes/activities.php) : les deux doivent donc
	 * charger les mêmes styles.
	 */
	private function page_est_archive_activities() {
		return is_category() || is_tag();
	}

	public function enqueue_assets() {
		$est_archive_activities = $this->page_est_archive_activities();
		$est_article            = is_singular( 'post' );
		$est_home_blog          = is_home();

		if ( ! $est_archive_activities && ! $est_article && ! $est_home_blog ) {
			return;
		}

		// Classes .am-activities-* communes (cartes d'articles), utilisées
		// aussi bien sur les archives Activities que sur les blocs par
		// catégorie du template "Blog Home".
		wp_enqueue_style(
			'am-post-refonte-style',
			AM_POST_REFONTE_URL . 'css/style.css',
			[],
			AM_POST_REFONTE_VERSION
		);

		if ( $est_archive_activities ) {
			// Toggle grille / liste de la toolbar (voir includes/shortcodes/activities.php
			// pour le fil d'Ariane, aucun rapport avec ce script).
			wp_enqueue_script(
				'am-post-refonte-view-toggle',
				AM_POST_REFONTE_URL . 'js/view-toggle.js',
				[],
				AM_POST_REFONTE_VERSION,
				true
			);
		}

		if ( $est_home_blog ) {
			wp_enqueue_style(
				'am-post-refonte-home',
				AM_POST_REFONTE_URL . 'css/home.css',
				[ 'am-post-refonte-style' ],
				AM_POST_REFONTE_VERSION
			);
			wp_enqueue_script(
				'am-post-refonte-home-slider',
				AM_POST_REFONTE_URL . 'js/home-slider.js',
				[],
				AM_POST_REFONTE_VERSION,
				true
			);
		}
	}
}
