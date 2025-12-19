<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://v2.citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/includes
 * @author     ED dev team <guillet.thomas.p@citeo.com>
 */
class Citeo_Articles_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'citeo-articles',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
