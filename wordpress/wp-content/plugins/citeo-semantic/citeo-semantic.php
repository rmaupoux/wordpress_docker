<?php

/**
 * Plugin Name:       Citeo semantique
 * Description:       Blocs gutenberg semantiques pour consommation dans d'autres plugins.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Dev Team Ecosystem Digital
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       semantic
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

function create_block_semantic_block_init() {

	$json_files = glob( __DIR__ . '/build/**/block.json' );

	// Auto register all blocks that were found.
	foreach ( $json_files as $file ) {
		if(str_contains($file, "block_MC-352_post-link-wrapper")) {

			require_once( __DIR__ . "/src/block_MC-352_post-link-wrapper/render.php" );
			register_block_type( 
				$file,  
				array(
					'render_callback' => 'render_block_post_link_wrapper',
				)
			);
			
		} else {
			register_block_type( $file );
		}
	};

	$css_file_path = plugin_dir_path(__DIR__) . 'citeo-semantic/dist/icon_dynamic.css';
	if(!file_exists($css_file_path)) {
		$dynamic_css = generate_icon_dynamic_style('icons');

		file_put_contents($css_file_path, $dynamic_css);	
	}

}
add_action('init', 'create_block_semantic_block_init');

function semantic_assets_enqueue() {

	$css_file_path = plugin_dir_path(__DIR__) . 'citeo-semantic/dist/icon_dynamic.css';
	if(!file_exists($css_file_path)) {	
		$dynamic_css = generate_icon_dynamic_style('icons');

		file_put_contents($css_file_path, $dynamic_css);
	} 
	wp_enqueue_style('icon-dynamic', plugins_url('citeo-semantic', dirname(__FILE__)) . '/dist/icon_dynamic.css', array(), '1.0', 'all');

	wp_enqueue_style('semantic-styling', plugins_url('citeo-semantic', dirname(__FILE__)) . '/dist/style.css', array(), '1.0', 'all');
	
	wp_enqueue_style('ds-styling', plugins_url('citeo-semantic', dirname(__FILE__)) . '/dist/ds-styles/allThemes.css', array(), '1.0', 'all');
}
add_action('enqueue_block_assets', 'semantic_assets_enqueue', 100);

add_action('enqueue_block_assets', function() {

	wp_enqueue_script(
        'stencil-loader',
        plugin_dir_url( __FILE__ ) . 'build/block_MC-171_icon/js/view.js',
        array( 'wp-blocks', 'wp-dom' ),
        '1.0',
        true
    );

});

/**
 * Create custom category for Citeo blocks
 * 
 * @see https://gutenberghub.com/how-to-create-custom-block-category/
 */
add_filter('block_categories_all', function($categories) {
    $custom_categories = [
		[
            'slug' => 'b2b-page-start-block',
            'title' => 'Démarrer une page',
        ],
		[
            'slug' => 'b2b-page-builder-block',
            'title' => 'Composer une page',
        ],
		[
            'slug' => 'b2b-redirect-block',
            'title' => 'Flécher la circulation vers des pages profondes du site',
        ],
		[
            'slug' => 'b2b-service-block',
            'title' => 'Promouvoir un service',
        ],
		[
            'slug' => 'b2b-funnel-block',
            'title' => 'Acquérir de nouveaux utilisateurs',
        ],
		[
            'slug' => 'b2b-engagement-block',
            'title' => 'Prolonger la lecture',
        ],
        [
            'slug' => 'b2b-article-block',
            'title' => 'Composer un article',
        ],
		[
            'slug' => 'b2b-one-page-block',
            'title' => 'Construire une page entière avec un bloc',
        ],
        [
            'slug' => 'b2c',
            'title' => 'Blocs B2C',
        ],
        [
            'slug' => 'onlr',
            'title' => 'Citeo : ONLR',
        ],
        [
            'slug' => 'citeo-jeunesse',
            'title' => 'Citeo : Jeunesse',
        ],
		[
            'slug' => 'semantic',
            'title' => 'Sous-blocs apportant une fonctionnalité à une section',
        ],
		[
            'slug' => 'article',
            'title' => 'Blocs d\'article',
        ],
    ];
    // Place toutes les catégories personnalisées en haut, dans l'ordre souhaité
    return array_merge($custom_categories, $categories);
}, 1);

/**
 * 
 * ENQUEUE CORE/BUTTON FRONTEND SCRIPT
 *  
 */ 
function register_button_block_js() {
	wp_register_script(
		'button-js',
		plugins_url('citeo-semantic', dirname(__FILE__)) . '/src/core_button/view.js',
		[],
		'1.0',
		true
	);
}
add_action( 'wp_enqueue_scripts', 'register_button_block_js' );

function filter_button_block_meta_settings( $settings, $metadata ) {

	// if this is not the button block.
	if ( 'core/button' !== $metadata['name'] ) {
		return $settings;
	}

	// set the script settings to the register script name.
	$settings['script'] = [ 'button-js' ];

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'filter_button_block_meta_settings', 10, 2 );


/**
 * 
 * CHANGING CORE/IMAGE SAVED DOM
 * 
*/
add_filter("render_block", "image_render_callback", 10, 3);
function image_render_callback( $content, $block ) {
    if($block['blockName'] !== 'core/image') {
        return $content;
    }

    $doc = new DOMDocument();
    $doc->loadHTML($block['innerHTML'], LIBXML_NOERROR);
    $image_DOM = $doc->getElementsByTagName('img')[0];
    $desktop_url = $image_DOM->getAttribute('src');
    $img_ttl = $image_DOM->getAttribute('title');
    $img_alt = $image_DOM->getAttribute('alt');
    $img_id = $doc->getElementsByTagName('figure')[0]->getAttribute('id');

    $image_link = $doc->getElementsByTagName('a')[0];

    $mobile_url = array_key_exists('mobileSrc', $block['attrs']) ? esc_url($block['attrs']['mobileSrc']) : $desktop_url;

    $className = array_key_exists('className', $block['attrs']) ? $block['attrs']['className'] : '';

    // Gestion du caption personnalisé
    $custom_caption = array_key_exists('customCaption', $block['attrs']) ? $block['attrs']['customCaption'] : '';
    $caption_html = $custom_caption ? '<figcaption class="wp-element-caption custom-caption">' . esc_html($custom_caption) . '</figcaption>' : '';
    
    $focal_point = array_key_exists('focalPoint', $block['attrs']) ? $block['attrs']['focalPoint'] : NULL;
    
	// If the objectFitType is default value it's not passed in the render and we default it back to 'cover'
	$objectFit = array_key_exists('objectFitType', $block['attrs']) ? $block['attrs']['objectFitType'] : 'cover';
	$focal_point_styles = 'object-fit: '. $objectFit .';';

	if($focal_point && $objectFit === 'cover') {
		$x_percent = floatval($focal_point['x']) * 100;
		$y_percent = floatval($focal_point['y']) * 100;

		$focal_point_styles .= 'object-position: ' . $x_percent . '% ' . $y_percent . '%;';
	} 

    if($image_link) {
        $link_url = $image_link->getAttribute('href');
        $link_target = $image_link->getAttribute('target');

        return '
            <figure class="wp-block-image ' . $className . '" id="' . $img_id . '">
                <a href="' . $link_url . '" target="' . $link_target . '">
                    <picture>
                        <source srcset="' . $desktop_url . '" media="(min-width:834px)">
                        <img src="' . $mobile_url . '" alt="' . $img_alt . '" title="' . $img_ttl . '" draggable="false" style="' . $focal_point_styles . '" />
                    </picture>
                </a>
                ' . $caption_html . '
            </figure>
        ';
    } else {
        return '
            <figure class="wp-block-image ' . $className . '" id="' . $img_id . '">
                <picture>
                    <source srcset="' . $desktop_url . '" media="(min-width:834px)">
                    <img src="' . $mobile_url . '" alt="' . $img_alt . '" title="' . $img_ttl . '" draggable="false" style="' . $focal_point_styles . '" />
                </picture>
                ' . $caption_html . '
            </figure>
        ';
    }	

}

/*
*
* CODE LOCALIZING CAPTCHA SITEKEY FOR NEWSLETTER
*
*/
function expose_acf_to_blocks_newsletter() {
    $acf_value = get_field('field_66963e1f4c802', 'option');
    wp_localize_script(
        'ds-citeocom-section-newsletter-editor-script',  
        'acfDataCaptcha',         
        array(
            'captchaSiteKey' => $acf_value,
        )
    );
}
add_action('enqueue_block_assets', 'expose_acf_to_blocks_newsletter');

/*
*
* CODE MANAGING ICONS IN MEDIA LIBRARY
*
*/
// Add categories to media images
function add_categories_to_attachments() {
	$labels = array(
		'name' => 'Catégories d\'images',
		'singular_name' => 'Catégorie d\'image',
		'search_items' => 'Rechercher des catégories',
		'all_items' => 'Toutes les catégories',
		'edit_item' => 'Modifier la catégorie',
		'update_item' => 'Mettre à jour la catégorie',
		'add_new_item' => 'Ajouter une nouvelle catégorie',
		'new_item_name' => 'Nom de la nouvelle catégorie',
		'menu_name' => 'Catégories d\'images',
	);

	$args = array (
		'labels' => $labels,
		'public' => true,
		'hierarchical' => true,
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array('slug' => 'categorie-image'),
	);

    register_taxonomy('image_category', array('attachment'), $args);
	register_taxonomy_for_object_type('image_category', 'attachment');
}
add_action( 'init' , 'add_categories_to_attachments', 100 );

function generate_icon_styling($post_ID) {
	// Checking if the current attachment has the icon category
	$post_terms = wp_get_post_terms($post_ID, 'image_category');
	$icons_term = get_term_by('slug', 'icons', 'image_category');
	$taxonomy_terms = get_term_children($icons_term->term_id, 'image_category');

	$is_icon = false;
	foreach($post_terms as $term) {
		if(in_array($term->term_id, $taxonomy_terms) || $term->slug === 'icons') {
			$is_icon = true;
			break;
		}
	}

	if(!$is_icon) return;

	$dynamic_css = generate_icon_dynamic_style('icons');

	// Create styling for icons
	$css_file_path = plugin_dir_path(__DIR__) . 'citeo-semantic/dist/icon_dynamic.css';
    file_put_contents($css_file_path, $dynamic_css);
}
add_action('edit_attachment', 'generate_icon_styling');
add_action('add_attachment', 'generate_icon_styling');
add_action('delete_attachment', 'generate_icon_styling');

// Add a dropdown filter to the media library
function add_media_library_filter($post_type) {
	if($post_type === 'attachment') {
		$taxonomy = 'image_category';
		$terms = get_terms(array(
			'taxonomy' => $taxonomy,
			'hide_empty' => false,
		));

		if(!empty($terms)) {
			echo '<select name="' . $taxonomy . '" id="filter-by' . $taxonomy . '">';
			echo '<option value="">Toutes les catégories</option>';

			foreach($terms as $term) {
				$selected = (isset($_GET[$taxonomy]) && $_GET[$taxonomy] == $term->slug) ? ' selected="selected"' : '';
				echo '<option value="' . $term->slug . '"' . $selected . '>' . $term->name . '</option>';
			}

			echo '</select>';
		}
	}
}
add_action('restrict_manage_posts', 'add_media_library_filter');

function filter_media_library($query) {
	if(isset($_GET['image_category']) && !empty($_GET['image_category'])) {
		$query->query_vars['tax_query'] = array(
			array(
				'taxonomy' => 'image_category',
				'field' => 'slug',
				'terms' => $_GET['image_category']
			),
		);
	}
}
add_action('pre_get_posts', 'filter_media_library');

// Util function to generate the icons list
function generate_icon_list($term) {
	$icons = query_attachment_children_term($term);

	$icon_list = [];
	
	// Format the icon list to export for contribution
	foreach($icons as $key=>$icon) {
		// Image URL : wp_get_attachment_url($icon->ID)
		// Image name : $icon->post_title
		// Image category : $icon->name

		if($icon->name === 'Icônes de menu') continue;
		// Preparing data for select display
		$icon_class = basename(wp_get_attachment_url($icon->ID), '.svg');
		$icon_list[$key]['label'] = $icon->post_title;
		$icon_list[$key]['value'] = $icon_class;
	}

	// Sort alphabetically
	asort($icon_list);

	return $icon_list;
}

// Util function to generate the icons styling
function generate_icon_dynamic_style($term) {
	$icons = query_attachment_children_term($term);

	$dynamic_css = '';
	
	// Format the icon list to export for contribution
	foreach($icons as $icon) {
		// Image URL : wp_get_attachment_url($icon->ID)
		// Image name : $icon->post_title
		// Image category : $icon->name

		$icon_url = wp_get_attachment_url($icon->ID);
		$icon_class = basename($icon_url, '.svg');

		// Adding css backgroun and masl-image values
		if($icon->name === 'Illustration') {
			$dynamic_css .= ".has-icon--" . $icon_class . " {
				--image-url: url(" . $icon_url . ");
				background-image: var(--image-url);
			}
			";
		} else {
			$dynamic_css .= ".has-prefix--" . $icon_class . " .wp-element-button::before, .has-suffix--" . $icon_class . " .wp-element-button::after, .has-icon--" . $icon_class . ", .list-icon--" . $icon_class . "::before {
				--image-url: url(" . $icon_url . ");
				mask-image: var(--image-url);
			}
			";
		}
	}

	return $dynamic_css;
}

// Util function to query a specific attachment category and its children
function query_attachment_children_term($term) {
	global $wpdb;

	// Returns all medias with icons categories or icons sub-categories
	$results = $wpdb->get_results("
		SELECT p.ID, p.post_title, t.name
		FROM {$wpdb->posts} p
		JOIN {$wpdb->term_relationships} tr ON p.id = tr.object_id
		JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
		JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
		WHERE p.post_type = 'attachment'
		AND p.post_status = 'inherit'
		AND tt.taxonomy = 'image_category'
		AND (
			tt.term_id = (SELECT term_id from {$wpdb->terms} WHERE slug = '{$term}')
			OR tt.parent = (SELECT term_id from {$wpdb->terms} WHERE slug = '{$term}')
		)
	");

	return $results;
}

// Register icon 
function citeo_icon_list_register() {
	// Separate each subcategory into its own list, merge them into an object key(term name) => iconList. Loop lists in json and reconcate them as needed (so likely illustration + menu_icon + main)

	$icon_parent_cat = get_term_by('slug', 'icons', 'image_category');
	if(!$icon_parent_cat->term_id) return;

	$terms = get_terms([
		'taxonomy' => 'image_category',
		'parent' => $icon_parent_cat->term_id,
		'hide_empty' => false, // show even if no posts assigned
	]);

	$icon_list_array = [];

	foreach($terms as $key=>$term) {
		$term_slug = $term->slug;
		$icon_list = generate_icon_list($term_slug);

		$icon_list_array[] = array(
			'name' => $term_slug,
			'list' => $icon_list
		);
	}

	wp_enqueue_script('icon-list', plugins_url('citeo-semantic', dirname(__FILE__)) . '/assets/iconList.js', array( 'wp-blocks', 'wp-dom-ready' ), '1.0.1', false);
	// $icon_list_json is a global variable
	wp_localize_script( 'icon-list', 'iconListJSON', $icon_list_array);
}
add_action('enqueue_block_editor_assets', 'citeo_icon_list_register', 1);

/*
*
*
*
*/

function citeo_setup() {
    add_theme_support('custom-logo', [
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
}
add_action('after_setup_theme', 'citeo_setup');

// Add mobile option to site logo
function citeo_register_large_logo($wp_customize) {
    // Add setting for mobile logo
    $wp_customize->add_setting('large_logo', [
        // 'sanitize_callback' => 'absint', // attachment ID expected
        'default' => '',
    ]);

    // Add image upload control for mobile logo
    $wp_customize->add_control(
        new WP_Customize_Image_Control(
            $wp_customize,
            'large_logo',
            [
                'label' => __('Logo large', 'citeo'),
                'section' => 'title_tagline', // default site identity section
                'settings' => 'large_logo',
            ]
        )
    );
}
add_action('customize_register', 'citeo_register_large_logo');

function citeo_custom_site_logo_large($block_content, $block) {
    if ($block['blockName'] === 'core/site-logo') {
        $attrs = $block['attrs'] ?? [];

        $standard_logo_id = get_theme_mod('custom_logo');
        $large_logo_url = get_theme_mod('large_logo');

        if (!$standard_logo_id && !$large_logo_url) {
            return $block_content;
        }

        $standard_logo_url = $standard_logo_id ? wp_get_attachment_image_src($standard_logo_id, 'full')[0] : '';

        // Prepare link attributes
        $target = isset($attrs['linkTarget']) && $attrs['linkTarget'] === '_blank' ? ' target="_blank"' : '';
        // If opening in new tab, add rel="noopener noreferrer" for security
        $rel = isset($attrs['linkTarget']) && $attrs['linkTarget'] === '_blank' ? ' rel="noopener noreferrer"' : ' rel="home"';

        $custom_logo_html = '
		<div class="wp-block-site-logo">
			<a href="' . esc_url(home_url('/')) . '"' . $target . $rel . ' class="custom-site-logo" aria-current="page">
				<img class="standard-logo" src="' . esc_url($standard_logo_url) . '" alt="' . esc_attr(get_bloginfo('name')) . '">
				<img class="large-logo" src="' . esc_url($large_logo_url) . '" alt="' . esc_attr(get_bloginfo('name')) . '">
			</a>
		</div>';

        return $custom_logo_html;
    }
    return $block_content;
}
add_filter('render_block', 'citeo_custom_site_logo_large', 20, 2);

// Custom Post Type: Ressources
function create_ressources_post_type() {
    $labels = array(
        'name'                  => _x('Ressources', 'Post type general name', 'citeo-semantic'),
        'singular_name'         => _x('Ressource', 'Post type singular name', 'citeo-semantic'),
        'menu_name'             => _x('Ressources', 'Admin Menu text', 'citeo-semantic'),
        'name_admin_bar'        => _x('Ressource', 'Add New on Toolbar', 'citeo-semantic'),
        'add_new'               => __('Ajouter une nouvelle', 'citeo-semantic'),
        'add_new_item'          => __('Ajouter une nouvelle ressource', 'citeo-semantic'),
        'new_item'              => __('Nouvelle ressource', 'citeo-semantic'),
        'edit_item'             => __('Modifier la ressource', 'citeo-semantic'),
        'view_item'             => __('Voir la ressource', 'citeo-semantic'),
        'all_items'             => __('Toutes les ressources', 'citeo-semantic'),
        'search_items'          => __('Rechercher des ressources', 'citeo-semantic'),
        'parent_item_colon'     => __('Ressource parente :', 'citeo-semantic'),
        'not_found'             => __('Aucune ressource trouvée.', 'citeo-semantic'),
        'not_found_in_trash'    => __('Aucune ressource trouvée dans la corbeille.', 'citeo-semantic'),
        'featured_image'        => _x('Image de la ressource', 'Overrides the "Featured Image" phrase', 'citeo-semantic'),
        'set_featured_image'    => _x('Définir l\'image de la ressource', 'Overrides the "Set featured image" phrase', 'citeo-semantic'),
        'remove_featured_image' => _x('Supprimer l\'image de la ressource', 'Overrides the "Remove featured image" phrase', 'citeo-semantic'),
        'use_featured_image'    => _x('Utiliser comme image de la ressource', 'Overrides the "Use as featured image" phrase', 'citeo-semantic'),
        'archives'              => _x('Archives des ressources', 'The post type archive label', 'citeo-semantic'),
        'insert_into_item'      => _x('Insérer dans la ressource', 'Overrides the "Insert into post"/"Insert into page" phrase', 'citeo-semantic'),
        'uploaded_to_this_item' => _x('Téléversé vers cette ressource', 'Overrides the "Uploaded to this post"/"Uploaded to this page" phrase', 'citeo-semantic'),
        'filter_items_list'     => _x('Filtrer la liste des ressources', 'Screen reader text for the filter links', 'citeo-semantic'),
        'items_list_navigation' => _x('Navigation de la liste des ressources', 'Screen reader text for the pagination', 'citeo-semantic'),
        'items_list'            => _x('Liste des ressources', 'Screen reader text for the items list', 'citeo-semantic'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'ressources'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-download',
        'show_in_rest'       => true,
        'supports'           => array('title', 'thumbnail', 'custom-fields'),
    );

    register_post_type('ressources', $args);
}
add_action('init', 'create_ressources_post_type');

// Custom Taxonomy: Types de ressources
function create_types_ressources_taxonomy() {
    $labels = array(
        'name'                       => _x('Types de ressources', 'Taxonomy General Name', 'citeo-semantic'),
        'singular_name'              => _x('Type de ressource', 'Taxonomy Singular Name', 'citeo-semantic'),
        'menu_name'                  => __('Types de ressources', 'citeo-semantic'),
        'all_items'                  => __('Tous les types', 'citeo-semantic'),
        'parent_item'                => __('Type parent', 'citeo-semantic'),
        'parent_item_colon'          => __('Type parent :', 'citeo-semantic'),
        'new_item_name'              => __('Nouveau type de ressource', 'citeo-semantic'),
        'add_new_item'               => __('Ajouter un nouveau type', 'citeo-semantic'),
        'edit_item'                  => __('Modifier le type', 'citeo-semantic'),
        'update_item'                => __('Mettre à jour le type', 'citeo-semantic'),
        'view_item'                  => __('Voir le type', 'citeo-semantic'),
        'separate_items_with_commas' => __('Séparer les types avec des virgules', 'citeo-semantic'),
        'add_or_remove_items'        => __('Ajouter ou supprimer des types', 'citeo-semantic'),
        'choose_from_most_used'      => __('Choisir parmi les plus utilisés', 'citeo-semantic'),
        'popular_items'              => __('Types populaires', 'citeo-semantic'),
        'search_items'               => __('Rechercher des types', 'citeo-semantic'),
        'not_found'                  => __('Aucun type trouvé', 'citeo-semantic'),
        'no_terms'                   => __('Aucun type', 'citeo-semantic'),
        'items_list'                 => __('Liste des types', 'citeo-semantic'),
        'items_list_navigation'      => __('Navigation de la liste des types', 'citeo-semantic'),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
        'show_in_rest'               => true,
        'rewrite'                    => array('slug' => 'type-ressources'),
        'has_archive'                => true, 
    );

    register_taxonomy('type-ressource', array('ressources'), $args);
}
add_action('init', 'create_types_ressources_taxonomy');

// Custom Taxonomy: Tags de ressources
function create_tags_ressources_taxonomy() {
    $labels = array(
        'name'                       => _x('Tags de ressources', 'Taxonomy General Name', 'citeo-semantic'),
        'singular_name'              => _x('Tag de ressource', 'Taxonomy Singular Name', 'citeo-semantic'),
        'menu_name'                  => __('Tags de ressources', 'citeo-semantic'),
        'all_items'                  => __('Tous les tags', 'citeo-semantic'),
        'new_item_name'              => __('Nouveau tag de ressource', 'citeo-semantic'),
        'add_new_item'               => __('Ajouter un nouveau tag', 'citeo-semantic'),
        'edit_item'                  => __('Modifier le tag', 'citeo-semantic'),
        'update_item'                => __('Mettre à jour le tag', 'citeo-semantic'),
        'view_item'                  => __('Voir le tag', 'citeo-semantic'),
        'separate_items_with_commas' => __('Séparer les tags avec des virgules', 'citeo-semantic'),
        'add_or_remove_items'        => __('Ajouter ou supprimer des tags', 'citeo-semantic'),
        'choose_from_most_used'      => __('Choisir parmi les plus utilisés', 'citeo-semantic'),
        'popular_items'              => __('Tags populaires', 'citeo-semantic'),
        'search_items'               => __('Rechercher des tags', 'citeo-semantic'),
        'not_found'                  => __('Aucun tag trouvé', 'citeo-semantic'),
        'no_terms'                   => __('Aucun tag', 'citeo-semantic'),
        'items_list'                 => __('Liste des tags', 'citeo-semantic'),
        'items_list_navigation'      => __('Navigation de la liste des tags', 'citeo-semantic'),
    );
    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => false, // Les tags ne sont pas hiérarchiques
        'public'                     => false, // Pas d'archives publiques
        'publicly_queryable'         => false, // Pas de requêtes publiques
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => false, // Pas dans les menus
        'show_tagcloud'              => false, // Pas de nuage de tags
        'show_in_rest'               => true,
        'has_archive'                => false, // Pas d'archives
    );
    register_taxonomy('tag-ressource', array('ressources'), $args);
}
add_action('init', 'create_tags_ressources_taxonomy');



// Assurer que la taxonomie est bien liée au custom post type
function link_ressources_taxonomy() {
    register_taxonomy_for_object_type('type-ressource', 'ressources');
}
add_action('init', 'link_ressources_taxonomy', 11);

// Repositionner l'image mise en avant en haut de la colonne droite
function move_featured_image_metabox() {
    remove_meta_box('postimagediv', 'ressources', 'side');
    add_meta_box('postimagediv', 'Image de la ressource', 'post_thumbnail_meta_box', 'ressources', 'side', 'high');
}
add_action('add_meta_boxes', 'move_featured_image_metabox');


// les CPT ressources ne doivent pas avoir de page single accessible
function ressources_single_template($template) {
    if ( is_singular('ressources') ) {

        wp_redirect(home_url());
        
    }
    return $template;
}
add_filter('template_include', 'ressources_single_template', 5);



 