<?php

/**
 * Plugin Name:       B2B
 * Description:       Blocks gutenberg B2B.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            ED dev team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       b2b
 * Requires Plugins: citeo-semantic, citeo-newsletter, advanced-custom-fields-pro
 *
 * @package CreateBlock
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function create_block_b2b_block_init() {

	$json_files = glob( __DIR__ . '/build/**/block.json' );
	// auto register all blocks that were found.
	foreach ( $json_files as $file ) {
		if(str_contains($file, "block_CC2-499_post-button")) {

			require_once( __DIR__ . "/src/block_CC2-499_post-button/index.php" );
			register_block_type( 
				$file,  
				array(
					'render_callback' => 'render_block_post_button',
				)
			);
			
		} else {
			register_block_type( $file );
		}
	};

	// ACF
	acf_add_options_page(array(
		'page_title'    => 'Thème: Paramètres général',
		'menu_title'    => 'Paramètres',
		'menu_slug'     => 'theme-general-settings',
		'capability'    => 'edit_posts',
		'redirect'      => false
	));

    
}
add_action('init', 'create_block_b2b_block_init');

function b2b_assets_enqueue() {
	wp_enqueue_style('b2b-css', plugins_url('b2b', dirname(__FILE__)) . '/dist/style.css', array(), '1.0', 'all');

    // wp_enqueue_style('ds-tokens', plugins_url('b2b', dirname(__FILE__)) . '/dist/ds-style.css', array(), '1.0', 'all');

    if ( !wp_style_is( 'b2b-header-css', 'enqueued' ) ) {
        wp_enqueue_style('b2b-header-css', plugins_url('b2b', dirname(__FILE__)) . '/dist/header.css', array(), '1.0', 'all');
    }  
}
add_action('enqueue_block_assets', 'b2b_assets_enqueue', 5);

function b2b_enqueue_assets() {
    wp_enqueue_script('b2b-header', plugins_url('b2b', dirname(__FILE__)) . '/assets/header.js', array(), '1.1.0', true);
}
add_action('wp_enqueue_scripts', 'b2b_enqueue_assets');

/**
 * 
 * Adding block variations
 * 
 */ 
function b2b_enqueue_editor_scripts() {
	wp_enqueue_script(
		'b2b-enqueue-block-variations',
		plugins_url('b2b', dirname(__FILE__)) . '/variations.js',
		array( 'wp-blocks', 'wp-dom-ready' ),
		'1.0',
		false
	);

    wp_enqueue_script(
		'b2b-env-list',
		plugins_url('b2b', dirname(__FILE__)) . '/assets/env-list.js',
		[],
		'1.0',
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'b2b_enqueue_editor_scripts' );


add_filter( 'script_loader_tag', function ( $tag, $handle ) {
    if ( 'b2b-env-list' === $handle ) {
        return str_replace( ' src', ' type="module" src', $tag );
    }
    return $tag;
}, 10, 2 );

// Get the default value of an ACF field
function acf_get_default_value_by_field_name( $field_name ) {
    // Get all registered field groups
    $field_groups = acf_get_field_groups();

    foreach ( $field_groups as $group ) {
        // Get all fields for this group
        $fields = acf_get_fields( $group['key'] );

        if ( !empty($fields) ) {
            foreach ( $fields as $field ) {
                if ( $field['name'] === $field_name ) {
                    // Return default value (or empty string if none)
                    return isset($field['default_value']) ? $field['default_value'] : '';
                }
            }
        }
    }

    // Field not found, return empty
    return '';
}

// Util to display current year next to copyright
function citeo_current_year_shortcode() {
    return date("Y");
}
add_shortcode('current_year', 'citeo_current_year_shortcode');

/**
 * Load HTML content from a template file.
 *
 * @param string $filename
 * @return string
 */
function citeo_get_block_template( $filename ) {
    $path = plugin_dir_path( __FILE__ ) . 'templates/' . $filename;

    if ( file_exists( $path ) ) {
        return file_get_contents( $path );
    }

    return '';
}

/**
 * Create footer reusable blocks if they don't already exist.
 */
function citeo_register_reusable_blocks() {
    $blocks = [
        [
            'title'   => 'Footer avec newsletter',
            'content' => citeo_get_block_template( 'footer-newsletter.php' ),
            'category' => [ 'footer' ]
        ],
        [
            'title'   => 'Footer avec téléphone',
            'content' => citeo_get_block_template( 'footer-contact.html' ),
            'category' => [ 'footer' ]
        ],
        [
            'title'   => 'Menu général',
            'content' => citeo_get_block_template( 'header-default.html' ),
            'category' => [ 'header' ]
        ],
        [
            'title'   => 'Template menu intérieur',
            'content' => citeo_get_block_template( 'header-internal.html' ),
            'category' => [ 'header' ]
        ]
    ];

    foreach ( $blocks as $block ) {
        citeo_initialize_reusable_block( $block['title'], $block['content'], $block['category'] );
    }

    // Create the shared dropdown bottom pattern
    $slug = 'shared-dropdown-links';

    $existing = get_page_by_path( $slug, OBJECT, 'wp_block' );
    if ( $existing ) return;

    $pattern_content = citeo_get_block_template('shared-dropdown-links.html');

    // Create the wp_block post
    wp_insert_post( [
        'post_title'   => 'Liens en bas de la modale',
        'post_name'    => $slug,
        'post_content' => $pattern_content,
        'post_type'    => 'wp_block',
        'post_status'  => 'publish',
    ] );
}
add_action( 'init', 'citeo_register_reusable_blocks' );

/**
 * Create a reusable block post if one doesn't exist yet.
 *
 * @param string $title
 * @param string $content
 * @param array  $categories
 * @return int Post ID
 */
function citeo_initialize_reusable_block( $title, $content, $categories = [] ) {
    $existing = get_page_by_title( $title, OBJECT, 'wp_block' );

    if ( $existing ) {
        return $existing->ID;
    }

    $post_id = wp_insert_post( [
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => 'wp_block',
    ] );

    if ( ! empty( $categories ) ) {
        wp_set_object_terms( $post_id, $categories, 'wp_pattern_category', true );
    }

    return $post_id;
}

// Add all footer & header patterns to their respective ACF field dropdown
function populate_acf_reusable_blocks( $field ) {
    // Reset choices
    $field['choices'] = [];

    if($field['name'] === 'page_header_pattern') {
        $default_title = 'Menu général';
        $term = 'header';
    } else {
        $default_title = 'Footer avec téléphone';
        $term = 'footer';
    }

    // Get all reusable blocks with the "footer" category (taxonomy: wp_pattern_category)
    $cat_blocks = get_posts([
        'post_type' => 'wp_block',
        'numberposts' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
        'tax_query' => [
            [
                'taxonomy' => 'wp_pattern_category',
                'field'    => 'slug',
                'terms'    => $term,
            ],
        ]
    ]);

    $default_id = null;

    foreach ( $cat_blocks as $block ) {
        $field['choices'][ $block->ID ] = $block->post_title;

        if ( $block->post_title === $default_title ) {
            $default_id = $block->ID;
        }
    }

    // Set default value
    if ( $default_id ) {
        $field['default_value'] = $default_id;
    }

    return $field;
}
add_filter('acf/load_field/name=page_header_pattern', 'populate_acf_reusable_blocks');
add_filter('acf/load_field/name=page_footer_pattern', 'populate_acf_reusable_blocks');

function auto_duplicate_header_footer_blocks($post_id, $post, $update) {
    // Prevent infinite loop
    remove_action('save_post_wp_block', 'auto_duplicate_header_footer_blocks', 20);

    // Only proceed if this is a published block
    if ($post->post_status !== 'publish') {
        return;
    }

    // Only duplicate if the block is in 'header' or 'footer' category
    $terms = wp_get_post_terms($post_id, 'wp_pattern_category', ['fields' => 'slugs']);
    if (!array_intersect($terms, ['header', 'footer'])) {
        return;
    }

    if (!function_exists('pll_get_post_language')) {
        return; // Polylang not active
    }

    $lang = pll_get_post_language($post_id);
    if (!$lang || $lang === 'en') {
        return; // Already English or language not set
    }

    $existing_translations = pll_get_post_translations($post_id);
    if (isset($existing_translations['en'])) {
        return; // English version already exists
    }

    // Duplicate the post
    $duplicate_id = wp_insert_post([
        'post_type'    => 'wp_block',
        'post_title'   => '[EN] ' . $post->post_title,
        'post_content' => $post->post_content,
        'post_status'  => 'publish',
        'post_excerpt' => $post->post_excerpt,
    ]);

    if (!$duplicate_id) {
        return; // failed to create duplicate
    }

    // Copy taxonomy terms (header/footer)
    wp_set_post_terms($duplicate_id, $terms, 'wp_pattern_category');

    // Assign English language
    if (function_exists('pll_set_post_language')) {
        pll_set_post_language($duplicate_id, 'en');
        // Link translation
        pll_save_post_translations(array_merge(pll_get_post_translations($post_id), ['en' => $duplicate_id]));
    }
}
add_action('save_post_wp_block', 'auto_duplicate_header_footer_blocks', 20, 3);

// Insert the pattern associated with the ACF field in the footer
add_action('wp_footer', function() {
    $block_id = get_field('page_footer_pattern');
    if(!$block_id) {
        $footer_blocks = get_posts([
            'post_type' => 'wp_block',
            'numberposts' => -1,
            'orderby' => 'title',
            'order' => 'ASC',
            'tax_query' => [
                [
                    'taxonomy' => 'wp_pattern_category',
                    'field'    => 'slug',
                    'terms'    => 'footer',
                ],
            ],
        ]);

        foreach ( $footer_blocks as $block ) {
            if ( $block->post_title === 'Footer avec téléphone' ) {
                $block_id = $block->ID;
                break;
            }
        }
    }

    $block_post = get_post($block_id);

    if ( $block_post && $block_post->post_type === 'wp_block' && $block_post->post_status === 'publish' ) {
        echo apply_filters('the_content', $block_post->post_content);
    }
});

// Insert the pattern associated with the ACF field in the header
add_action('wp_head', function() {
    $block_id_2 = get_field('page_header_pattern');
    if(!$block_id_2) {
        $header_blocks = get_posts([
            'post_type' => 'wp_block',
            'numberposts' => -1,
            'orderby' => 'title',
            'order' => 'ASC',
            'tax_query' => [
                [
                    'taxonomy' => 'wp_pattern_category',
                    'field'    => 'slug',
                    'terms'    => 'header',
                ],
            ],
        ]);

        foreach ( $header_blocks as $block ) {
            if ( $block->post_title === 'Menu général' ) {
                $block_id_2 = $block->ID;
                break;
            }
        }
    }

    $block_post = get_post($block_id_2);

    if ( $block_post && $block_post->post_type === 'wp_block' && $block_post->post_status === 'publish' ) {
        echo '<div class="dropdown-background"></div>';
        echo apply_filters('the_content', $block_post->post_content);
    }
});

// Override the core/block render to plug in the stencil components (icons and external arrows)
function b2b_navigation_link_render($block_content, $block) {
    $stencil_component = '';

    if (
        isset($block['attrs']['hasIcon']) && $block['attrs']['hasIcon'] 
        && isset($block['attrs']['dsIcon']) && $block['attrs']['dsIcon']
    ) {
        $icon_tag = str_replace( 'icon-core_', '', $block['attrs']['dsIcon'] );
        $icon_tag .= '-icon-component';

        $stencil_component = '<' . $icon_tag . ' size="16" color="var(--ds-icon-color)"></' . $icon_tag . '>';

        $needle = '<span class="wp-block-navigation-item__label">';
        $pos = strpos($block_content, $needle);

        if ($pos !== false) {
            // Insert stencil component right before the span
            $block_content = substr_replace($block_content, $stencil_component, $pos, 0);
        }
        
    }

    if (isset($block['attrs']['opensInNewTab']) && $block['attrs']['opensInNewTab']) {
        $external_arrow = '<arrow-up-right-icon-component size="12" color="var(--ds-semantic-color-layout-content-medium)"></arrow-up-right-icon-component>';

        $block_content = str_replace('</a>', $external_arrow . '</a>', $block_content);
    }

    return $block_content;
}
add_filter('render_block_core/navigation-link', 'b2b_navigation_link_render', 10, 2);
add_filter('render_block_core/navigation-submenu', 'b2b_navigation_link_render', 10, 2);

// Expose the site main post page (Le Mag page) to the rest-api
add_action('rest_api_init', function () {
    register_rest_route('b2b/v1', '/mag-url', [
        'methods'  => 'GET',
        'callback' => function () {
            $posts_page_id = get_option('page_for_posts');
            $url = $posts_page_id ? get_permalink($posts_page_id) : '';
            return rest_ensure_response([ 'url' => $url ]);
        },
        'permission_callback' => '__return_true',
    ]);
});


// Redirect archive template
function citeo_404_template( $page_template ) {
	// Enqueue 404 CSS
	wp_enqueue_style('b2b-404-css', plugins_url('b2b', dirname(__FILE__)) . '/dist/citeo-404.css', array(), '1.0', 'all');
	
	$page_template = dirname( __FILE__ ) . '/partials/citeo-404.php';

  return $page_template;
}
add_filter( '404_template', 'citeo_404_template' );

/**
 * Shortcode pour afficher le sélecteur de langues Polylang
 * Usage: [lang_switcher]
 */
function citeo_language_switcher_shortcode($atts) {
    // Vérifier si Polylang est installé et actif
    if (!function_exists('pll_the_languages')) {
        return '<!-- Polylang plugin not found -->';
    }
    
    // Vérifier s'il y a au moins 2 langues configurées dans Polylang
    $languages = pll_languages_list();
    if (count($languages) < 2) {
        return '<!-- No languages configured -->';
    }
    
    // Pour les pages/posts spécifiques, vérifier s'il y a des traductions publiées
    $current_post_id = get_the_ID();
    if ($current_post_id && !is_home() && !is_archive() && !is_search() && !is_404()) {
        $translations = pll_get_post_translations($current_post_id);
        
        // Filtrer pour ne garder que les traductions publiées
        $published_translations = array();
        foreach ($translations as $lang => $post_id) {
            if (get_post_status($post_id) === 'publish') {
                $published_translations[$lang] = $post_id;
            }
        }
        
        // Si c'est une page/post spécifique ET qu'il n'y a pas de traductions publiées, ne pas afficher
        if (count($published_translations) < 2) {
            return '<!-- No published translations available for this specific page -->';
        }
    }
    
    ob_start();
    ?>
    <div class="lang-swap">
        <ul class="lang-menu">
            <?php pll_the_languages(array(
                'show_flags' => 0,
                'hide_current' => 1
            )); ?>
        </ul>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('lang_switcher', 'citeo_language_switcher_shortcode');



// Redirect archive template for type-ressource taxonomy
function citeo_archive_type_ressource_template( $template ) {
    global $wp_query;
    
    // Handle specific term archives
    if ( is_tax( 'type-ressource' ) ) {
        $new_template = plugin_dir_path( __FILE__ ) . 'partials/archive-type-ressource.php';
        if ( file_exists( $new_template ) ) {
            return $new_template;
        }
    }
    
    // Handle general taxonomy archive by checking the request URI
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    if ( strpos( $request_uri, '/ressources/' ) !== false || 
         rtrim( $request_uri, '/' ) === '/ressources' ) {
        $new_template = plugin_dir_path( __FILE__ ) . 'partials/archive-type-ressource.php';
        if ( file_exists( $new_template ) ) {
            return $new_template;
        }
    }
    
    return $template;
}
add_filter( 'template_include', 'citeo_archive_type_ressource_template' );