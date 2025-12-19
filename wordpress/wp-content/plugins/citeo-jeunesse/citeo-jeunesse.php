<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://citeo.com
 * @since             1.0.0
 * @package           Citeo_Jeunesse
 *
 * @wordpress-plugin
 * Plugin Name:       Citeo Jeunesse
 * Requires Plugins: citeo-semantic, citeo-newsletter, advanced-custom-fields-pro
 * Plugin URI:        https://citeo.com
 * Description:       Plugin Jeunesse Citeo
 * Version:           1.0.0
 * Author:            ED dev team
 * Author URI:        https://citeo.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       citeo-jeunesse
 * Domain Path:       /languages
 * 
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
require_once(ABSPATH.'wp-includes/pluggable.php');
include_once ABSPATH . 'wp-admin/includes/plugin.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CITEO_JEUNESSE_VERSION', '1.0.0' );
define( 'WP_CITEO_JEUNESSE_DB_VERSION', '1.1' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-citeo-jeunesse-activator.php
 */
function activate_citeo_jeunesse() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-citeo-jeunesse-activator.php';
	Citeo_Jeunesse_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-citeo-jeunesse-deactivator.php
 */
function deactivate_citeo_jeunesse() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-citeo-jeunesse-deactivator.php';
	Citeo_Jeunesse_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_citeo_jeunesse' );
register_deactivation_hook( __FILE__, 'deactivate_citeo_jeunesse' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-citeo-jeunesse.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_citeo_jeunesse() {

	$plugin = new Citeo_Jeunesse();
	$plugin->run();

}
run_citeo_jeunesse();


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_citeo_jeunesse_block_init() {
    $json_files = glob( __DIR__ . '/build/**/block.json' );
    // auto register all blocks that were found.
    foreach ( $json_files as $file ) {
        register_block_type( $file );
    };
}
add_action( 'init', 'create_block_citeo_jeunesse_block_init' );

/**
 * Registers a custom block category for Citeo: Jeunesse.
 *
 * @param array $categories The existing block categories.
 * @return array The modified categories array.
 */
// function register_custom_block_jeunesse_category( $categories ) {
//     $categories[] = [
//         'slug'  => 'citeo-jeunesse',
//         'title' => 'Citeo : Jeunesse',
//     ];
//     return $categories;
// }
// add_filter( 'block_categories_all', 'register_custom_block_jeunesse_category', 10, 4 );

function jeunesse_callAPI($method, $url, $data, $api_token){
    $curl = curl_init();
    switch ($method){
       case "POST":
          curl_setopt($curl, CURLOPT_POST, true);
          if ($data)
             curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
          break;
       case "PUT":
          curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
          if ($data)
             curl_setopt($curl, CURLOPT_POSTFIELDS, $data);			 					
          break;
       default:
          if ($data)
             $url = sprintf("%s?%s", $url, http_build_query($data));
    }
    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
       'x-auth-token: ' . $api_token,
       'Accept: application/json',
       'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // EXECUTE:
    $result = curl_exec($curl);
    if(!$result){return false;}
    curl_close($curl);
    return $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && (isset($_POST['submit_jeunesse_form_video']) || isset($_POST['submit_jeunesse_form_autre']))) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'citeo_jeunesse_form';
    // Sécurisation (sanitization/validation)
    $type = isset($_POST['type']) ? sanitize_text_field($_POST['type']) : 'Non défini';
    $statut = isset($_POST['statut']) ? sanitize_text_field($_POST['statut']) : 'Non défini';
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : null;
    if (!$email || !is_email($email)) {
        throw new Exception(__('Adresse email invalide', 'citeo'));
    }
    // Hachage sécurisé de l'email avec le sel WordPress
    $email_hash = wp_hash($email, 'secure');
    $nombre_enfant = isset($_POST['nombre_enfant']) ? intval($_POST['nombre_enfant']) : null;
    $visionnement_video = isset($_POST['visionnement_video']) ? (bool)$_POST['visionnement_video'] : false;
    $opt_in = (bool)$_POST['receive_news'];
    $sondage_opt_out = (bool)$_POST['refuse_surveys'];
    $redirectVideo = $_POST['typeVideo'] ? $_POST['typeVideo'] : null;
    $redirectDownload = $_POST['typeDownload'] ? $_POST['typeDownload'] : null;

    if (is_plugin_active( "citeo-newsletter/citeo-newsletter.php" )) {
        if ($opt_in) {
            $table_name_newsletter = $wpdb->prefix . 'citeo_newsletter_subscriptions';
            
            // Vérifier l'existence de la souscription
            $existing_subscription = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM $table_name_newsletter WHERE email = %s AND type_newsletter = %s",
                $email,
                'jeunesse'
            ));

            if ($existing_subscription) {
                // Mise à jour de la date d'inscription
                $wpdb->update(
                    $table_name_newsletter,
                    ['signup_date' => current_time('mysql')],
                    ['email' => $email, 'type_newsletter' => 'jeunesse'],
                    ['%s'], // Format des données à mettre à jour
                    ['%s', '%s'] // Format de la clause WHERE
                );
            } else {
                // Nouvelle insertion
                $wpdb->insert(
                    $table_name_newsletter,
                    [
                        'email' => $email,
                        'type_newsletter' => 'jeunesse',
                        'signup_date' => current_time('mysql')
                    ],
                    ['%s', '%s', '%s'] // Formats des colonnes
                );
            }

            // Appel API après insertion/mise à jour
            $options = get_option('citeo_newsletter_options');
            $api_url = $options['url_api_base'];
            $api_token = $options['token_api_mob_jeunesse'];
            $api_jeunesse_active = isset($options['enable_feature_jeunesse']) ? (bool)$options['enable_feature_jeunesse'] : false;
            
            if ($api_jeunesse_active) {
                // Récupération des données du formulaire
                $data_array =  array(
                    "newsletterName" => "jeunesse",
                    "consentmentEmail"  => true,
                    "consentmentRgpd"   => true,
                    "email"             => $email
                );
                $make_call = jeunesse_callAPI('POST', 'https://'. $api_url .'/api/players', json_encode($data_array), $api_token);
            }
        }
    }

    if (!$sondage_opt_out) {
        // Ajout dans table sondage
        $table_name_sondage = $wpdb->prefix . 'citeo_jeunesse_sondage';
        // Vérifier l'existence de la souscription
        $existing_sondage = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name_sondage WHERE email = %s",
            $email
        ));

        if ($existing_sondage) {
            // Mise à jour de la date d'inscription
            $wpdb->update(
                $table_name_sondage,
                ['date_inscription' => current_time('mysql')],
                ['email' => $email],
                ['%s'], // Format des données à mettre à jour
                ['%s'] // Format de la clause WHERE
            );
        } else {
            $wpdb->insert(
                $table_name_sondage,
                [
                    'email' => $email,
                ],
                ['%s']
            );
        }
    }

    
    // Insertion des données principales
    $wpdb->insert(
        $table_name,
        [
            'type' => $type,
            'statut' => $statut,
            'email' => $email_hash,
            'nombre_enfant' => $nombre_enfant,
            'visionnement_video' => $visionnement_video,
            'opt_in' => $opt_in,
            'refuse_survey' => $sondage_opt_out
        ],
        ['%s', '%s', '%s', '%d', '%d', '%d', '%d']
    );

    // Enregistrement d'un cookie pour 1 an
    $cookie_params = [
        'expires'  => time() + YEAR_IN_SECONDS,
        'path'     => COOKIEPATH,
        'domain'   => COOKIE_DOMAIN,
        'secure'   => is_ssl(),
        'httponly' => true,
        'samesite' => 'Lax'
    ];
    setcookie('enregistrement_jeunesse', '1', $cookie_params);
    if ($redirectVideo != null) {
        wp_redirect( $redirectVideo );
        exit;
    } else if ($redirectDownload != null) {
        wp_redirect( $redirectDownload );
        exit;
    }
}


function expose_acf_to_blocks() {
    $acf_value = get_field('field_66963e1f4c802', 'option');
    wp_localize_script(
        'citeo-jeunesse-coup-pouce-video-editor-script',  
        'acfDataCaptcha',         
        array(
            'captchaSiteKey' => $acf_value,
            'currentLang' => function_exists('pll_current_language') ? pll_current_language() : 'en',
        )
    );
}
add_action('enqueue_block_assets', 'expose_acf_to_blocks');

// Generated by ACF
add_action( 'init', function() {
	register_post_type( 'magazine-jeunesse', array(
        'labels' => array(
            'name' => 'Magazines jeunesse',
            'singular_name' => 'Magazine jeunesse',
            'menu_name' => 'Magazines jeunesse',
            'all_items' => 'Tous les Magazines jeunesse',
            'edit_item' => 'Modifier le Magazine jeunesse',
            'view_item' => 'Voir le Magazine jeunesse',
            'view_items' => 'Voir les Magazines jeunesse',
            'add_new_item' => 'Ajouter un Magazine jeunesse',
            'new_item' => 'Nouveau Magazine jeunesse',
            'parent_item_colon' => 'Magazine jeunesse parent :',
            'search_items' => 'Rechercher des Magazines jeunesse',
            'not_found' => 'Pas de magazine jeunesse trouvé',
            'not_found_in_trash' => 'Pas de magazine jeunesse trouvé dans la corbeille',
            'archives' => 'Archives des Magazine jeunesse',
            'attributes' => 'Attributs du Magazine jeunesse',
            'insert_into_item' => 'Insert into magazine jeunesse',
            'uploaded_to_this_item' => 'Uploaded to this magazine jeunesse',
            'filter_items_list' => 'Filter magazines jeunesse list',
            'filter_by_date' => 'Filter magazines jeunesse by date',
            'items_list_navigation' => 'Magazines jeunesse list navigation',
            'items_list' => 'Magazines jeunesse list',
            'item_published' => 'Magazine jeunesse published.',
            'item_published_privately' => 'Magazine jeunesse published privately.',
            'item_reverted_to_draft' => 'Magazine jeunesse reverted to draft.',
            'item_scheduled' => 'Magazine jeunesse scheduled.',
            'item_updated' => 'Magazine jeunesse updated.',
            'item_link' => 'Magazine jeunesse Link',
            'item_link_description' => 'A link to a magazine jeunesse.',
        ),
        'public' => true,
        'exclude_from_search' => true,
        'show_in_nav_menus' => false,
        'show_in_rest' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-nametag',
        'supports' => array(
            0 => 'title',
            1 => 'editor',
            2 => 'excerpt',
            3 => 'thumbnail',
            4 => 'custom-fields',
        ),
        'taxonomies' => array(
            0 => 'magazine-year',
        ),
        'rewrite' => array(
            'pages' => false,
        ),
        'delete_with_user' => false,
        'template' => array(
            array('citeo-semantic/block-accordeon', array(
                'lock' => array(
                    'move' => false,
                    'remove' => true,
                ),
            ), 
                array(
                    array('core/button', array(
                        'className' => 'accordeon-toggle is-style-tertiary',
                        'metadata' => array(
                            'name' => 'Contrôle de l\'accordéon'
                        ),
                        'placeholder' => 'Titre du magazine',
                        'lock' => array(
                            'move' => true,
                            'remove' => true,
                        ),
                    )),
                    array('core/group', 
                        array(
                            'metadata' => array(
                                'name' => 'Contenu de l\'accordéon'
                            ),
                            'className' => 'accordeon-content',
                            'layout' => array(
                                'type' => 'flex',
                                'flexWrap' => 'nowrap',
                                'justifyContent' => 'space-between',
                                'verticalAlign' => 'start',
                            ),
                            'lock' => array(
                                'move' => true,
                                'remove' => true,
                            ),
                        ), 
                        array(
                            array('core/group', 
                                array(
                                    'metadata' => array(
                                        'name' => 'Titre, description et bouton du magazine'
                                    ),
                                    'className' => 'mag-txt-wrap',
                                ), 
                                array(
                                    array('core/paragraph', array(
                                        'className' => 'mag-date',
                                        'typo' => 'Body-3',
                                        'placeholder' => 'Contribution ignorée. Prend dynamiquement la date de publication',
                                        'lock' => array(
                                            'move' => false,
                                            'remove' => true,
                                        ),
                                    )),
                                    array('core/heading', array(
                                        'level' => 6,
                                        'placeholder' => 'Titre du magazine',
                                    )),
                                    array('core/paragraph', array(
                                        'typo' => 'Body-2',
                                        'placeholder' => 'Description du magazine',
                                    )),
                                    array('core/buttons', array(),
                                        array(
                                            array('core/button', array(
                                                'variationName' => 'download',
                                                'placeholder' => 'Bouton de téléchargement',
                                            )),
                                        ),
                                    ),
                                ),
                            ),
                            array('core/image', array(
                                'metadata' => array(
                                    'name' => 'Image mise en avant'
                                ),
                                'className' => 'mag-featured-img'
                            )),
                        ),
                    ),
                ),
            ),
        ),
    ) );

    register_taxonomy( 'magazine-year', array(
	    0 => 'magazine-jeunesse',
    ), array(
        'labels' => array(
            'name' => 'Année de publication',
            'singular_name' => 'Année de publication',
            'menu_name' => 'Années de publication',
            'all_items' => 'Toutes les Années de publication',
            'edit_item' => 'Modifier l\'Année de publication',
            'view_item' => 'Voir l\'Année de publication',
            'update_item' => 'Mettre à jour l\'Année de publication',
            'add_new_item' => 'Ajouter une Année de publication',
            'new_item_name' => 'Année de publication',
            'search_items' => 'Rechercher des années de publication',
            'popular_items' => 'Année de publication populaire',
            'separate_items_with_commas' => 'Séparer les Années de publication avec une virgule',
            'add_or_remove_items' => 'Ajouter ou retirer une Année de publication',
            'choose_from_most_used' => 'Choisir parmi les Années de publication les plus utilisés',
            'not_found' => 'Pas d\'Année de publication trouvé',
            'no_terms' => 'Aucune Année de publication',
            'items_list_navigation' => 'Année de publication list navigation',
            'items_list' => 'Année de publication list',
            'back_to_items' => '← Aller à « Année de publication »',
            'item_link' => 'Année de publication Link',
            'item_link_description' => 'Un lien vers une Année de publication',
        ),
        'public' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'show_tagcloud' => false,
    ) );
} );

function jeunesse_single_template($template) {
    if ( is_singular('magazine-jeunesse') ) {

        wp_redirect(home_url());
        
    }
    return $template;
}
add_filter('template_include', 'jeunesse_single_template', 5);
