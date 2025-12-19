<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://v2.citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/admin
 * @author     ED dev team <guillet.thomas.p@citeo.com>
 */
class Citeo_Articles_Admin {

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
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/citeo-articles-admin.css', array(), $this->version, 'all' );

	}

	public function enqueue_block_editor_styles() {}

	/**
	 * Register the JavaScript for the admin area.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/citeo-articles-admin.js', array(), $this->version, false );

		
		$screen = get_current_screen();

		// Only load inside the Site Editor (Appearance → Editor)
		if ( $screen && $screen->id === 'site-editor' ) {
			wp_enqueue_script(
				'root-container-categories',
				plugin_dir_url(__FILE__) . 'js/root-container-categories.js',
				['wp-blocks', 'wp-dom-ready', 'wp-edit-post'],
				null,
				true
			);
		}
	}

}
