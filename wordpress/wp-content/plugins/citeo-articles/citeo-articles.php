<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://v2.citeo.com
 * @since             1.0.0
 * @package           Citeo_Articles
 *
 * @wordpress-plugin
 * Plugin Name:       Citeo : Articles
 * Plugin URI:        https://v2.citeo.com
 * Description:       Plugin générant le code nécessaire à la gestion des articles (fichiers de template, filtres de recherche, blocs d'articles, ...)
 * Version:           1.0.0
 * Author:            ED dev team
 * Author URI:        https://v2.citeo.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       citeo-articles
 * Domain Path:       /languages
 * Requires Plugins: citeo-semantic
 * 
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CITEO_ARTICLES_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-citeo-articles-activator.php
 */
function activate_citeo_articles() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-citeo-articles-activator.php';
	Citeo_Articles_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-citeo-articles-deactivator.php
 */
function deactivate_citeo_articles() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-citeo-articles-deactivator.php';
	Citeo_Articles_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_citeo_articles' );
register_deactivation_hook( __FILE__, 'deactivate_citeo_articles' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-citeo-articles.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_citeo_articles() {

	$plugin = new Citeo_Articles();
	$plugin->run();

}
run_citeo_articles();

// Exposer les champs ACF dans l'API REST
function add_acf_to_rest_api() {
    // Ajouter le champ sous_titre_articles à l'API REST pour les posts
    register_rest_field( 'post',
        'acf',
        array(
            'get_callback' => function( $post_arr ) {
                return array(
                    'sous_titre_articles' => get_field('sous_titre_articles', $post_arr['id'])
                );
            },
            'update_callback' => null,
            'schema' => array(
                'description' => 'ACF Fields',
                'type' => 'object'
            )
        )
    );
}
add_action( 'rest_api_init', 'add_acf_to_rest_api' );

// Redirect archive template - Use the same template as search
function citeo_archive_template( $page_template ) {
	$page_template = dirname( __FILE__ ) . '/public/partials/citeo-search.php';

  return $page_template;
}
add_filter( 'archive_template', 'citeo_archive_template' );

// Redirect single template
function citeo_single_template( $page_template ) {
	$page_template = dirname( __FILE__ ) . '/public/partials/citeo-single.php';

  return $page_template;
}
add_filter( 'single_template', 'citeo_single_template' );

// Redirect search template
function citeo_search_template( $page_template ) {
	$page_template = dirname( __FILE__ ) . '/public/partials/citeo-search.php';

  return $page_template;
}
add_filter( 'search_template', 'citeo_search_template' );

// Redirect searchform template
function citeo_searchform_template( $page_template ) {
	$page_template = dirname( __FILE__ ) . '/public/partials/citeo-searchform.php';

  return $page_template;
}
add_filter( 'searchform_template', 'citeo_searchform_template' );

// Redirect article home template : check that the theme has a front-page.php defined otherwise this will override the homepage
function citeo_home_template( $page_template ) {
	$page_template = dirname( __FILE__ ) . '/public/partials/citeo-home.php';

  return $page_template;
}
add_filter( 'home_template', 'citeo_home_template' );


function the_archive_breadcrumb() {
  $breadcrumb = '';
  $sep = ' <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="#111827"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 18l6-6-6-6"
                ></path>
            </svg> ';

  // Si on est sur une page de recherche, afficher "Accueil > Recherche"
  if (is_search()) {
    $breadcrumb .= '<div class="breadcrumbs">';
    $breadcrumb .= '<a href="' . esc_url(home_url('/')) . '">' . get_post(get_option('page_on_front'))->post_title . '</a>';
    $breadcrumb .= $sep;
    $breadcrumb .= '<span>' . __('Recherche', 'citeo') . '</span>';
    $breadcrumb .= $sep . '<span>' . esc_html(get_search_query()) . '</span>';
    $breadcrumb .= '</div>';
  }

  // Si on est sur une page catégorie, afficher uniquement la catégorie
  if (is_category()) {
    $category = single_cat_title('', false); // Récupère le nom de la catégorie
    $breadcrumb .= '<div class="breadcrumbs">';
    $breadcrumb .= '<a href="' . esc_url(home_url('/')) . '">' . get_post(get_option('page_on_front'))->post_title . '</a>';
    $breadcrumb .= $sep;
    $breadcrumb .= '<span>' . esc_html($category) . '</span>';
    $breadcrumb .= '</div>';
  }

  echo $breadcrumb;
}

function citeo_search_where_title_and_tags( $search, $wp_query ) {
    global $wpdb;

    // Only modify main front-end search queries
    if ( is_admin() || ! $wp_query->is_main_query() || ! $wp_query->is_search() ) {
        return $search;
    }

    $s = $wp_query->get( 's' );
    if ( empty( $s ) ) {
        return $search; // nothing to do
    }

    // Escape for LIKE
    $like = '%' . $wpdb->esc_like( $s ) . '%';

    // Search only in post_title OR any related tag name (partial match)
    $title_where = $wpdb->prepare( "{$wpdb->posts}.post_title LIKE %s", $like );

    $tag_exists = $wpdb->prepare(
        "EXISTS (
            SELECT 1
            FROM {$wpdb->term_relationships} tr
            INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
            INNER JOIN {$wpdb->terms} t ON tt.term_id = t.term_id
            WHERE tr.object_id = {$wpdb->posts}.ID
              AND tt.taxonomy = 'post_tag'
              AND t.name LIKE %s
        )",
        $like
    );

    // combine and return a clean WHERE fragment (note leading AND matches WP's default structure)
    $new_where = " AND ( {$title_where} OR {$tag_exists} ) ";

    return $new_where;
}
add_filter( 'posts_search', 'citeo_search_where_title_and_tags', 10, 2 );

function citeo_limit_search_to_title_and_tags( $query ) {
    if ( is_admin() || ! $query->is_main_query() || ! $query->is_search() ) {
        return;
    }

    // Only published posts
    $query->set( 'post_type', 'post' );
    $query->set( 'post_status', 'publish' );
    $query->set( 'has_password', false );
}
add_action( 'pre_get_posts', 'citeo_limit_search_to_title_and_tags' );


function citeo_rest_filter_posts($args, $request) {
  if (!empty($request['search'])) {
      $search_term = sanitize_text_field($request['search']);

      // Force published posts, exclude password-protected
      $args['post_status'] = 'publish';
      $args['has_password'] = false;

      // Still set 's' so WordPress triggers the search mechanism
      $args['s'] = $search_term;

      // Filter the search SQL
      add_filter('posts_search', function($search, $wp_query) use ($search_term) {
          global $wpdb;

          // Only affect REST API queries
          if (!defined('REST_REQUEST') || !REST_REQUEST) return $search;

          // Sanitize and build LIKE clause
          $like = '%' . $wpdb->esc_like($search_term) . '%';

          $search = $wpdb->prepare(
              " AND (
                  {$wpdb->posts}.post_title LIKE %s 
                  OR {$wpdb->posts}.ID IN (
                      SELECT object_id
                      FROM {$wpdb->term_relationships}
                      INNER JOIN {$wpdb->term_taxonomy} ON {$wpdb->term_taxonomy}.term_taxonomy_id = {$wpdb->term_relationships}.term_taxonomy_id
                      INNER JOIN {$wpdb->terms} ON {$wpdb->terms}.term_id = {$wpdb->term_taxonomy}.term_id
                      WHERE taxonomy = 'post_tag' AND {$wpdb->terms}.name LIKE %s
                  )
              )",
              $like, $like
          );

          return $search;
      }, 10, 2);
  }

  return $args;
}
add_filter('rest_post_query', 'citeo_rest_filter_posts', 10, 2);



add_filter('post_thumbnail_html', function ($html, $post_id, $post_thumbnail_id, $size, $attr) {
  
  $external_image = get_post_meta($post_id, 'external_featured_image', true);

  // Si une image keepeek est définie, remplacer l'image à la une
  if (!empty($external_image)) {
      $alt = get_the_title($post_id); 
      $html = '<img src="' . esc_url($external_image) . '" alt="' . esc_attr($alt) . '" class="external-featured-image"/>';
  }

  return $html;
}, 10, 5);


// AnteChronologie des articles Pour les archives Categorie et Search

function citeo_sort_posts_by_date($query) {
  if (!is_admin() && $query->is_main_query() && (is_archive() || is_search())) {
      $query->set('post_type', 'post');
      $query->set('orderby', 'date');
      $query->set('order', 'DESC');
  }
}
add_action('pre_get_posts', 'citeo_sort_posts_by_date');

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_articles() {
	$json_files = glob( __DIR__ . '/build/**/block.json' );
	foreach ( $json_files as $file ) {
		register_block_type( $file );
	};
}
add_action( 'init', 'create_block_articles' );

// Create a non synchronized block pattern to be used in post_type => post
function citeo_register_article_patterns() {
    register_block_pattern_category( 'article-patterns', [ 'label' => __( 'Compositions d\'articles', 'citeo' ) ] );
}
add_action( 'init', 'citeo_register_article_patterns' );

// Add all article-patterns patterns to its linked ACF field dropdown
function populate_acf_article_patterns( $field ) {
    // Reset choices
    $field['choices'] = [];

    $field['choices'][''] = '— Pas de blocs —';

    // Get all reusable blocks with the "article-patterns" category (taxonomy: wp_pattern_category)
    $cat_blocks = get_posts([
        'post_type' => 'wp_block',
        'numberposts' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
        'tax_query' => [
            [
                'taxonomy' => 'wp_pattern_category',
                'field'    => 'slug',
                'terms'    => 'article-patterns',
            ],
        ]
    ]);

    foreach ( $cat_blocks as $block ) {
        $field['choices'][ $block->ID ] = $block->post_title;
    }

    return $field;
}
add_filter('acf/load_field/name=post_default_article_patterns', 'populate_acf_article_patterns');

function override_post_featured_image_block($block_content, $block) {
    if ($block['blockName'] === 'core/post-featured-image') {
        global $post;

        $external_image = get_post_meta($post->ID, 'external_featured_image', true);

        if (!empty($external_image)) {
            return '<figure class="wp-block-post-featured-image">
                        <img src="' . esc_url($external_image) . '" alt="' . esc_attr(get_the_title($post->ID)) . '">
                    </figure>';
        }
    }

    return $block_content;
}
add_filter('render_block', 'override_post_featured_image_block', 10, 2);

function citeo_add_blocks_to_new_post_editor($content, $post) {
    if ($post->post_type !== 'post') {
        return $content;
    }

    if ( !empty($_GET['post']) ) {
        return $content;
    }

    $pattern_id = get_field('post_default_article_patterns', 'option');
    
    // If the ACF field is set to reset value
    if( empty($pattern_id) ) return $content;

    $block_post = get_post($pattern_id);
    if (!$block_post) return $content;

    $sync_status = get_post_meta($pattern_id, 'wp_pattern_sync_status', true);
    if( $sync_status && $sync_status === 'unsynced') $is_synced = false;
    else $is_synced = true;

    if( $is_synced ) $block_markup = '<!-- wp:block {"ref":' . $pattern_id . '} /-->';
    else {
        $block_markup = $block_post->post_content;
    }

    return $block_markup;
}
add_filter('default_content', 'citeo_add_blocks_to_new_post_editor', 10, 2);

/**
 * Shortcode pour afficher les tags de l'article actuel avec le nombre d'articles
 * Usage: [tags_with_count show_count="true" post_id="123"]
 */
function citeo_tags_with_count_shortcode($atts) {
    // Paramètres par défaut
    $atts = shortcode_atts(array(
        'show_count' => 'true',
        'post_id' => get_the_ID(), // ID de l'article actuel par défaut
        'orderby' => 'count',
        'order' => 'DESC',
        'class' => 'tags-with-count'
    ), $atts);

    // Récupérer les tags de l'article spécifique
    $post_id = intval($atts['post_id']);
    
    if (!$post_id) {
        return '<p>Aucun article spécifié.</p>';
    }
    
    $post_tags = get_the_tags($post_id);

    if (!$post_tags || is_wp_error($post_tags)) {
        return '';
    }

    // Trier les tags selon les critères
    if ($atts['orderby'] === 'count') {
        usort($post_tags, function($a, $b) use ($atts) {
            if ($atts['order'] === 'DESC') {
                return $b->count - $a->count;
            } else {
                return $a->count - $b->count;
            }
        });
    } elseif ($atts['orderby'] === 'name') {
        usort($post_tags, function($a, $b) use ($atts) {
            if ($atts['order'] === 'DESC') {
                return strcmp($b->name, $a->name);
            } else {
                return strcmp($a->name, $b->name);
            }
        });
    }

    $output = '<div class="' . esc_attr($atts['class']) . '">';
    
    foreach ($post_tags as $tag) {
        $tag_link = get_tag_link($tag->term_id);
        $tag_name = $tag->name;
        $post_count = $tag->count;
        
        $output .= '<span class="tag-item">';
        $output .= '<a href="' . esc_url($tag_link) . '" class="tag-link ds-text-base">';
        $output .= esc_html($tag_name);
        $output .= '</a>';
        
        if ($atts['show_count'] === 'true') {
            $article_text = ($post_count > 1) ? 'articles' : 'article';
            $output .= ' <span class="tag-count">' . $post_count . ' ' . $article_text . '</span>';
        }
        
        $output .= '</span>';
    }
    
    $output .= '</div>';
    
    return $output;
}
add_shortcode('tags_with_count', 'citeo_tags_with_count_shortcode');

/**
 * Traiter les shortcodes dans le contenu des blocs
 */
function citeo_process_shortcodes_in_blocks($block_content, $block) {
    // Traiter les shortcodes pour le bloc section-go-further
    if ($block['blockName'] === 'citeo-articles/section-go-further') {
        $block_content = do_shortcode($block_content);
    }
    return $block_content;
}
add_filter('render_block', 'citeo_process_shortcodes_in_blocks', 10, 2);

/**
 * Rendu côté frontend pour le bloc ACF sous-titre
 */
function render_acf_sous_titre_block($block_content, $block) {
    if ($block['blockName'] === 'citeo-articles/acf-sous-titre') {
        global $post;
        
        if (!$post) {
            return '';
        }
        
        $sous_titre = get_field('sous_titre_articles', $post->ID);
        
        if (empty($sous_titre)) {
            return '';
        }
        
        $class_name = isset($block['attrs']['className']) ? $block['attrs']['className'] : '';
        
        return '<div class="wp-block-citeo-articles-acf-sous-titre ' . esc_attr($class_name) . '">' . esc_html($sous_titre) . '</div>';
    }
    
    return $block_content;
}
add_filter('render_block', 'render_acf_sous_titre_block', 10, 2);

/**
 * Shortcode pour afficher la barre de recherche Citeo
 */
function citeo_searchbar_shortcode($atts) {
    // Définir les attributs par défaut
    $atts = shortcode_atts(array(
        'class' => ''
    ), $atts, 'citeo_searchbar');
    
    // Commencer la capture de sortie
    ob_start();
    ?>
    <div class="archive-page__search">
        <form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
           
            <div class="loading-search loader" style="display:none" role="status" aria-live="polite" aria-label="Chargement en cours">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M8.96105 15.5275C8.06645 15.5597 7.17426 15.4155 6.33541 15.1029C5.49657 14.7904 4.7275 14.3156 4.07212 13.7059C3.41673 13.0961 2.88787 12.3632 2.51572 11.5491C2.14358 10.7349 1.93544 9.85541 1.90318 8.96081C1.87093 8.06621 2.0152 7.17402 2.32775 6.33518C2.6403 5.49633 3.11501 4.72726 3.72478 4.07188C4.33455 3.4165 5.06744 2.88763 5.8816 2.51549C6.69576 2.14334 7.57525 1.9352 8.46985 1.90295C9.36444 1.8707 10.2566 2.01496 11.0955 2.32751C11.9343 2.64007 12.7034 3.11478 13.3588 3.72455C14.0142 4.33432 14.543 5.06721 14.9152 5.88137C15.2873 6.69553 15.4955 7.57501 15.5277 8.46961C15.56 9.36421 15.4157 10.2564 15.1031 11.0952C14.7906 11.9341 14.3159 12.7032 13.7061 13.3585C13.0963 14.0139 12.3634 14.5428 11.5493 14.9149C10.7351 15.2871 9.85564 15.4952 8.96104 15.5275L8.96105 15.5275Z" stroke="#D1D5DB" stroke-width="2"/>
                    <path d="M15.5091 8.15716C15.632 9.6527 15.258 11.147 14.445 12.4083C13.6321 13.6696 12.4257 14.6274 11.0129 15.1332" stroke="#6B7280" stroke-width="2"/>
                </svg>
            </div>
            <label>
                <span class="screen-reader-text"><?php _e('Rechercher :', 'citeo'); ?></span>
                 <button type="submit" disabled class="search-submit">
                <?php _e('Rechercher', 'citeo'); ?>
                </button>
                <input type="search" placeholder="<?php _e('Recherchez un article ou une thématique', 'citeo'); ?>" class="search-field" value="<?php echo get_search_query(); ?>" name="s" autocomplete="off" />
                <button type="reset" class="search-clear" aria-label="Effacer la recherche">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6569 7.75759C18.0474 7.36707 18.0474 6.7339 17.6569 6.34338C17.2663 5.95285 16.6332 5.95285 16.2426 6.34338L12 10.586L7.75736 6.34338C7.36684 5.95285 6.73367 5.95285 6.34315 6.34338C5.95262 6.7339 5.95262 7.36707 6.34315 7.75759L10.5858 12.0002L6.34315 16.2429C5.95262 16.6334 5.95262 17.2666 6.34315 17.6571C6.73367 18.0476 7.36683 18.0476 7.75736 17.6571L12 13.4144L16.2426 17.6571C16.6332 18.0476 17.2663 18.0476 17.6569 17.6571C18.0474 17.2666 18.0474 16.6334 17.6569 16.2429L13.4142 12.0002L17.6569 7.75759Z" fill="#6B7280"/>
                    </svg>
                </button>
            
            </label>
        </form>
            <div class="search-overlay"></div>
             <?php
        $tags = get_tags([
            'orderby' => 'count', 
            'order' => 'DESC',    
            'number' => 4        
        ]);
        ?>
        <div class="archive-page__tags">
            <?php if (!empty($tags)) : ?>
                <div class="ds-text-xsmall-strong"><?php _e('Recommandé', 'citeo'); ?></div>
                <ul>
                    <?php foreach ($tags as $tag) : ?>
                        <li class="tag">
                            <a class="ds-text-small" href="<?php echo get_tag_link($tag->term_id); ?>">
                                <?php echo $tag->name; ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>

       


        <!-- <div class="archive-page__postsNumber">
            <?php
            printf(
                _n(
                    '%d article', 
                    '%d articles', 
                    $wp_query->found_posts, 
                    'citeo' 
                ),
                $wp_query->found_posts,
                get_search_query()
            );
            ?>
        </div> -->
    </div>
    <?php
    
    // Récupérer et retourner le contenu capturé
    return ob_get_clean();
}
add_shortcode('citeo_searchbar', 'citeo_searchbar_shortcode');