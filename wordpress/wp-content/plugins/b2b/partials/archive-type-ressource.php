<?php
// Enqueue du CSS spécifique à ce template
wp_enqueue_style('archives-ressources-css', plugin_dir_url(__FILE__) . '../dist/archives-ressources.css', array(), '1.0', 'all');

get_header();
?>

<?php
// Vérifier si on est sur un terme spécifique ou sur l'archive générale
$current_term = get_queried_object();



// Query pour récupérer le dernier CPT ressource (pour la sidebar)
$latest_ressource_args = array(
    'post_type' => 'ressources',
    'posts_per_page' => 1,
    'orderby' => 'date',
    'order' => 'DESC'
);

// Si on est sur un terme spécifique, filtrer par ce terme
if ( $current_term && isset($current_term->term_id) ) {
    $latest_ressource_args['tax_query'] = array(
        array(
            'taxonomy' => 'type-ressource',
            'terms' => $current_term->term_id,
        )
    );
}

$latest_ressource_query = new WP_Query($latest_ressource_args);

// Query pour récupérer les ressources suivantes (pour la liste)
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

// Calculer l'offset correct en tenant compte de la pagination
$posts_per_page = 7;
$offset = 1; // Toujours exclure le premier
$calculated_offset = $offset + (($paged - 1) * $posts_per_page);

$other_ressources_args = array(
    'post_type' => 'ressources',
    'posts_per_page' => $posts_per_page,
    'orderby' => 'date',
    'order' => 'DESC',
    'offset' => $calculated_offset
);

// Si on est sur un terme spécifique, filtrer par ce terme
if ( $current_term && isset($current_term->term_id) ) {
    $other_ressources_args['tax_query'] = array(
        array(
            'taxonomy' => 'type-ressource',
            'terms' => $current_term->term_id,
        )
    );
}

$other_ressources_query = new WP_Query($other_ressources_args);
?>
<main class="page page--archive-type-ressource">
    <section>

        <?php 
                $texte_reglementation = get_field('titre_ressources', 'option');
                if ($texte_reglementation) {
                    echo '<h1>' . wp_kses_post($texte_reglementation) . '</h1>';
                }
        ?>
        <div class="taxomony-list">
        <div class="wp-block-buttons main-cta-wrap is-layout-flex wp-block-buttons-is-layout-flex">
            <?php
            // Récupérer tous les termes de la taxonomie type-
            // ressource

            // Déterminer la classe pour le bouton "Toutes publications"
            $all_button_class = (!$current_term) ? 'is-style-primary' : 'is-style-secondary';
            
            if ( is_tax( 'type-ressource' ) && $current_term ) {

            ?>
                <div class="wp-block-button <?php echo $all_button_class; ?>">
                    <a class="wp-block-button__link <?php echo $all_button_class; ?>" href="../">
                        <?php _e('toutes les ressources', 'b2b'); ?>
                    </a>
                </div>
            <?php

            } else {
            ?>
                <div class="wp-block-button <?php echo $all_button_class; ?>">
                    <a class="wp-block-button__link <?php echo $all_button_class; ?>" href="./">
                        <?php _e('toutes les ressources', 'b2b'); ?>
                    </a>
                </div>
            <?php
            }

            $terms = get_terms(array(
                'taxonomy' => 'type-ressource',
                'hide_empty' => false,
                'orderby' => 'name',
                'order' => 'ASC'
            ));

            if (!empty($terms) && !is_wp_error($terms)) :
                foreach ($terms as $term) :
                    $term_link = get_term_link($term);
                    $style_class = ($current_term && $current_term->term_id === $term->term_id) ? 'is-style-primary' : 'is-style-secondary';
            ?>
                <div class="wp-block-button <?php echo $style_class; ?>">
                    <a class="wp-block-button__link wp-element-button" href="<?php echo esc_url($term_link); ?>">
                        <?php echo esc_html($term->name); ?>
                    </a>
                </div>
            <?php 
                endforeach;
            endif;
            ?>
        </div>

        <div class="ressource--list-number">
            <?php
            // Calculer le nombre total de ressources
            $total_count_args = array(
                'post_type' => 'ressources',
                'posts_per_page' => -1,
                'post_status' => 'publish'
            );

            // Si on est sur un terme spécifique, filtrer par ce terme
            if ( $current_term && isset($current_term->term_id) ) {
                $total_count_args['tax_query'] = array(
                    array(
                        'taxonomy' => 'type-ressource',
                        'terms' => $current_term->term_id,
                    )
                );
            }

            $total_count_query = new WP_Query($total_count_args);
            $total_count = $total_count_query->found_posts;
            wp_reset_postdata();

            // Déterminer le type de ressource pour l'affichage
            if ( $current_term && isset($current_term->name) ) {
                $resource_type = strtolower($current_term->name);
            } else {
                $resource_type = 'ressources';
            }

            echo '<p>' . sprintf(_n('Résultat : %d appel à projet', 'Résultats : %d ressources', $total_count, 'b2b'), $total_count) . '</p>';
            ?>
        </div>

        </div>
        <div class="results">
            <div class="results--list">
                <?php if ($other_ressources_query->have_posts()) : ?>
                    <ul>
                        <?php while ($other_ressources_query->have_posts()) : $other_ressources_query->the_post(); ?>
                            <?php 
                            $current_post_id = get_the_ID();
                            $url_ressource = get_field('url_ressource', $current_post_id);
                            ?>
                            <li>
                                <?php if ($url_ressource && isset($url_ressource['url'])) : ?>
                                <a href="<?php echo esc_url($url_ressource['url']); ?>" download class="ressource--link">
                                <?php endif; ?>
                                
                                <?php if (has_post_thumbnail()) : ?>
                                    <div class="ressource--thumb">
                                        <?php the_post_thumbnail('thumbnail'); ?>
                                    </div>
                                <?php else : ?>
                                    <div class="ressource--empty-thumb"></div>
                                <?php endif; ?>

                                <div class="ressource--textes">

                                    <div class="ressource--title"><?php the_title(); ?>
                                    </div>

                                    <div class="ressource--tags">
                                        <?php 
                                        $tags = get_the_terms(get_the_ID(), 'tag-ressource');
                                        if ($tags && !is_wp_error($tags)) :
                                        ?>
                                            <div class="ressource--tag">
                                                <?php foreach ($tags as $tag) : ?>
                                                    <span class="tag"><?php echo esc_html($tag->name); ?></span>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php endif; ?>
                                        <div class="ressource--date">
                                            • <?php echo get_the_date('F Y'); ?>
                                        </div>
                                    </div>
                                
                                </div>

                                <div class="ressource--download">
                                    <?php 
                                    if ($url_ressource) {
                                        if (isset($url_ressource['filesize'])) {
                                            echo _e('Télécharger : ') . size_format($url_ressource['filesize']);
                                        }
                                    }
                                    ?>
                                </div>
                                
                                <?php if ($url_ressource && isset($url_ressource['url'])) : ?>
                                </a>
                                <?php endif; ?>

                            </li>
                        <?php endwhile; ?>
                    </ul>
                    
                    <!-- Pagination -->
                    <?php
                    // Calculer le nombre total d'éléments pour la pagination (en excluant le premier)
                    $total_count_for_pagination_args = array(
                        'post_type' => 'ressources',
                        'posts_per_page' => -1,
                        'post_status' => 'publish'
                    );
                    
                    if ( $current_term && isset($current_term->term_id) ) {
                        $total_count_for_pagination_args['tax_query'] = array(
                            array(
                                'taxonomy' => 'type-ressource',
                                'terms' => $current_term->term_id,
                            )
                        );
                    }
                    
                    $total_for_pagination = new WP_Query($total_count_for_pagination_args);
                    $total_posts_minus_one = max(0, $total_for_pagination->found_posts - 1); // Moins 1 pour exclure celui de la sidebar
                    $max_pages = ceil($total_posts_minus_one / $posts_per_page);
                    wp_reset_postdata();

                    $current_page = max(1, get_query_var('paged'));
                    
                    if ($max_pages > 1) : ?>
                        <div class="pagination">
                            <span aria-hidden="true" class="screen-reader-line"></span>
                            
                            <nav class="navigation pagination" aria-label="Pagination des publications">
                                <h2 class="screen-reader-text">Pagination des publications</h2>
                                <div class="nav-links">
                                    <?php if ($current_page > 1) : ?>
                                        <a class="prev page-numbers" href="<?php echo get_pagenum_link($current_page - 1); ?>">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0893 4.49017C12.7639 4.16473 12.2362 4.16473 11.9108 4.49017L6.91078 9.49017C6.58535 9.81561 6.58535 10.3432 6.91078 10.6687L11.9108 15.6687C12.2362 15.9941 12.7639 15.9941 13.0893 15.6687C13.4147 15.3432 13.4147 14.8156 13.0893 14.4902L8.67862 10.0794L13.0893 5.66868C13.4147 5.34325 13.4147 4.81561 13.0893 4.49017Z"></path>
                                            </svg>
                                           <?php _e('Page précédente', 'b2b'); ?>
                                        </a>
                                    <?php endif; ?>
                                    
                                    <?php for ($i = 1; $i <= $max_pages; $i++) : ?>
                                        <?php if ($i == $current_page) : ?>
                                            <span aria-current="page" class="page-numbers current"><?php echo $i; ?></span>
                                        <?php else : ?>
                                            <a class="page-numbers" href="<?php echo get_pagenum_link($i); ?>"><?php echo $i; ?></a>
                                        <?php endif; ?>
                                    <?php endfor; ?>
                                    
                                    <?php if ($current_page < $max_pages) : ?>
                                        <a class="next page-numbers" href="<?php echo get_pagenum_link($current_page + 1); ?>">
                                            <?php _e('Page suivante', 'b2b'); ?>  
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.9107 4.49017C7.23614 4.16473 7.76378 4.16473 8.08921 4.49017L13.0892 9.49017C13.4147 9.81561 13.4147 10.3432 13.0892 10.6687L8.08921 15.6687C7.76378 15.9941 7.23614 15.9941 6.9107 15.6687C6.58527 15.3432 6.58527 14.8156 6.9107 14.4902L11.3214 10.0794L6.9107 5.66868C6.58527 5.34325 6.58527 4.81561 6.9107 4.49017Z"></path>
                                            </svg>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </nav>
                        </div>
                    <?php endif;
                    ?>
                <?php else : ?>
                    <p>Aucune autre ressource trouvée.</p>
                <?php endif; ?>
                <?php wp_reset_postdata(); ?>
            </div>
            
            <div class="results--sidebar">
                <?php if ($latest_ressource_query->have_posts()) : ?>
                    <?php while ($latest_ressource_query->have_posts()) : $latest_ressource_query->the_post(); ?>
                        <div class="latest-ressource">
                            <span class="latest-ressource--intro"><?php _e('Nouveauté'); ?></span>
                            <article>
                                <?php if (has_post_thumbnail()) : ?>
                                    <div class="ressource-thumbnail">
                                        <?php the_post_thumbnail('medium'); ?>
                                    </div>
                                <?php else : ?>
                                    <div class="latest-ressource--empty-thumbnail" role="img" aria-label="<?php esc_attr_e('Image non disponible', 'b2b'); ?>"></div>
                                <?php endif; ?>
                                <div class="latest-ressource--title"><?php the_title(); ?></div>
                                <div class="latest-ressource--tags">
                                        <?php 
                                        $tags = get_the_terms(get_the_ID(), 'tag-ressource');
                                        if ($tags && !is_wp_error($tags)) :
                                        ?>
                                                <div class="latest-ressource--tag">
                                                    <?php foreach ($tags as $tag) : ?>
                                                        <span class="tag"><?php echo esc_html($tag->name); ?></span>
                                                    <?php endforeach; ?>
                                                </div>
                                        <?php endif; ?>
                                        <div class="latest-ressource--date">
                                            •&nbsp;&nbsp;<?php echo get_the_date('F Y'); ?>
                                        </div>
                                </div>
                                
                                <?php 
                                $url_ressource = get_field('url_ressource');
                                if ($url_ressource && isset($url_ressource['url'])) : 
                                ?>
                                    <div class="latest-ressource--buttons wp-block-buttons">
                                        <div class="wp-block-button is-style-secondary has-suffix--icon-core_file-text">
                                            <a href="<?php echo esc_url($url_ressource['url']); ?>" target="_blank" class="wp-block-button__link wp-element-button"><?php _e('Voir'); ?></a>
                                        </div>
                                        <div class="wp-block-button is-style-primary has-suffix--Download">
                                            <a href="<?php echo esc_url($url_ressource['url']); ?>" download class="wp-block-button__link wp-element-button"><?php _e('Télécharger'); ?></a>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </article>
                        </div>
                    <?php endwhile; ?>


                    
                <?php else : ?>
                    <p>Aucune ressource trouvée.</p>
                <?php endif; ?>
                <?php wp_reset_postdata(); ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
