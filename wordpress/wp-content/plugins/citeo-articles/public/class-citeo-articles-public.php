<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://v2.citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/public
 * @author     ED dev team <guillet.thomas.p@citeo.com>
 */
class Citeo_Articles_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		// Ajouter les filtres pour supprimer les limitations d'exergue
		add_filter( 'excerpt_length', array( $this, 'unlimited_excerpt_length' ), 999 );
		add_filter( 'excerpt_more', array( $this, 'no_excerpt_more' ), 999 );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Citeo_Articles_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Citeo_Articles_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		 
		 if (is_archive() || is_search() || is_home()) {
			 wp_enqueue_style( $this->plugin_name . '-archive', plugin_dir_url( __FILE__ ) . 'css/citeo-archive-public.css', array(), $this->version, 'all' );
		 }
		 if (is_single()) {
			 wp_enqueue_style( $this->plugin_name . '-articles', plugin_dir_url( __FILE__ ) . 'css/citeo-articles-public.css', array(), $this->version, 'all' );
		 }

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Citeo_Articles_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Citeo_Articles_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if(is_archive() || is_search() || is_home()){
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/citeo-articles-public.js', array(), $this->version, true );
		} else if (is_single()) {
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/citeo-articles-copy.js', array(), $this->version, true );
		}

		wp_localize_script($this->plugin_name, 'searchQuery', array(
			'ajaxurl' => admin_url('admin-ajax.php')
		));

		// Localize script for share counter data - only on single pages where the script is loaded
		/*
		if (is_single()) {
			wp_localize_script($this->plugin_name, 'shareCounterData', array(
				'ajax_url' => admin_url('admin-ajax.php'),
				// 'shared_text' => __('partages', 'citeo-articles'), 
				'copied_text' => __('Lien copié !', 'citeo-articles'),
				'error_text' => __('Une erreur est survenue lors de la copie du lien. Veuillez réessayer.', 'citeo-articles')
			));
		}
		*/
	}

	/**
	 * Custom excerpt wrapper for single posts.
	 *
	 * @since    1.0.0
	 * @param    string    $excerpt    The post excerpt.
	 * @return   string    The modified excerpt with custom wrapper.
	 */
	public function custom_excerpt_wrapper( $excerpt ) {
		if ( is_single() ) {
			global $post;
			
			// Vérifier si un extrait manuel est défini dans le BO
			$manual_excerpt = $post->post_excerpt ?? '';
			$manual_excerpt = trim( $manual_excerpt );
			
			// Si aucun extrait manuel n'est défini, ne rien afficher
			if ( empty( $manual_excerpt ) ) {
				return '';
			}
			
			// Nettoyer l'extrait manuel et l'afficher
			$clean_excerpt = strip_tags( $manual_excerpt );
			$clean_excerpt = trim( $clean_excerpt );
			
			if ( ! empty( $clean_excerpt ) ) {
				return '<p class="ds-heading-2">' . $clean_excerpt . '</p>';
			}
		}
		return $excerpt;
	}

	/**
	 * Remove excerpt length limit for single posts.
	 *
	 * @since    1.0.0
	 * @param    int    $length    The excerpt length.
	 * @return   int    Unlimited length.
	 */
	public function unlimited_excerpt_length( $length ) {
		if ( is_single() ) {
			return 999999; // Pratiquement illimité
		}
		return $length;
	}

	/**
	 * Remove "..." from excerpt for single posts.
	 *
	 * @since    1.0.0
	 * @param    string    $more    The "more" string.
	 * @return   string    Empty string.
	 */
	public function no_excerpt_more( $more ) {
		if ( is_single() ) {
			return '';
		}
		return $more;
	}

}
