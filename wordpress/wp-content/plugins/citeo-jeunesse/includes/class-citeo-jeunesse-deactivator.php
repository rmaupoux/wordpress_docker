<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 * @author     citeo <citeo@citeo.com>
 */
class Citeo_Jeunesse_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
        wp_clear_scheduled_hook('citeo_jeunesse_cleanup_event');
    }
}
