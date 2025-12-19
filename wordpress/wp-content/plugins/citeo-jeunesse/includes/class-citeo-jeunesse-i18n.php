<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 * @author     citeo <citeo@citeo.com>
 */
class Citeo_Jeunesse_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'citeo-jeunesse',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
