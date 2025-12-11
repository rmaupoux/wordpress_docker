<?php
/**
 * Plugin Name:       Test Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       test-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_test_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_test_block_block_init' );


add_action('enqueue_block_assets', function() {
	$script_url = plugin_dir_url(__FILE__) . 'build/view.js';
    $script_path = plugin_dir_path(__FILE__) . 'build/view.js';

	wp_enqueue_script(
		'stencil-loader',
		plugin_dir_url(__FILE__) . 'build/view.js',
		array('wp-blocks', 'wp-dom'),
		file_exists($script_path) ? filemtime($script_path) : null, // Sécurité supplémentaire
		true
	);
});
