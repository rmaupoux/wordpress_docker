<?php get_header(); ?>

<main>
    <?php if (is_archive()) : ?>
        <?php the_archive_breadcrumb(); ?>
    <?php else : ?>
        <!-- <?php the_archive_breadcrumb(); ?> -->
    <?php endif; ?>
    
    <section class="wp-block-citeo-articles-search-barre alignfull">
        <div class="archive-page">
        
            <?php if (is_category() || is_tag()) : ?>
                <div class="archive-page__description">
                    <?php 
                    if (is_category()) {
                        echo category_description();
                    } elseif (is_tag()) {
                        echo tag_description();
                    }
                    ?>
                </div>
            <?php endif; ?>

            <?php echo do_shortcode('[citeo_searchbar]'); ?>
        </div>
    </section>
    <section class="section-archive-page--title">
        <h1 class="archive-page__title archive-page__title-search ">
            <?php 
            if (is_search()) {
                echo get_search_query();
            } elseif (is_category()) {
                single_cat_title();
            } elseif (is_tag()) {
                single_tag_title();
            } else {
                echo get_search_query();
            }
            ?>
        </h1>
    </section>

    

    <section class="archive-page__posts">

<div class="archive-page__posts--left">
    <div class="archive-page__postsNumber">
        <span>
        <?php
        if (empty(get_search_query())) {
            printf(
                _n(
                    '%d résultat', 
                    '%d résultats', 
                    $wp_query->found_posts, 
                    'citeo'
                ),
                $wp_query->found_posts
            );
        } else if ($wp_query->found_posts === 0) {
            printf(
                __('%d résultat', 'citeo'), 
                0 
            );
        } else {
            printf(
                _n(
                    '%d résultat', 
                    '%d résultats', 
                    $wp_query->found_posts, 
                    'citeo' 
                ),
                $wp_query->found_posts,
                get_search_query()
            );
        }
        ?>
        </span>
        <span class="number-line" aria-hidden="true"></span>
    </div>
        <?php if (have_posts()) : ?>
            <div class="archive-page__posts__list">
                <?php while (have_posts()) : the_post(); ?>
                    <article class="wp-block-post">
                        <a href="<?php the_permalink(); ?>" class="wp-block-post-href">
                            <div class="post-thumbnail">
                                    <?php if (has_post_thumbnail()) : ?>
                                        <?php the_post_thumbnail('medium'); ?>
                                    <?php else : ?>
                                        <div class="post-thumbnail-empty"></div>
                                    <?php endif; ?>
                            </div>
                        <div class="article-wrapper">
                            <?php 
                            // Affichage du sous-titre ACF
                            $sous_titre = get_field('sous_titre_articles');
                            if ($sous_titre) : ?>
                                <div class="ds-display-2"><?php echo esc_html($sous_titre); ?></div>
                            <?php endif; ?>

                            
                            <h2 class="ds-heading-4 wp-block-post-title">
                                <?php the_title(); ?>
                            </h2>
                            
                            <div class="wp-block-post-date">
                                <time datetime="<?php echo get_the_date('c'); ?>">
                                <?php echo get_the_date('j M, Y'); ?>
                            </div>
                        </div>
                            </a>
                        <div class="ds-text-small wp-block-post-terms">
                            <?php the_tags('', '', ''); ?>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <span aria-hidden="true" class="screen-reader-line"></span>
                <?php
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0893 4.49017C12.7639 4.16473 12.2362 4.16473 11.9108 4.49017L6.9108 9.49017C6.58537 9.81561 6.58537 10.3432 6.9108 10.6687L11.9108 15.6687C12.2362 15.9941 12.7639 15.9941 13.0893 15.6687C13.4147 15.3432 13.4147 14.8156 13.0893 14.4902L8.67857 10.0794L13.0893 5.66868C13.4147 5.34325 13.4147 4.81561 13.0893 4.49017Z" />
                    </svg>  Page précédente',
                    'next_text' => 'Page suivante  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.9107 4.49017C7.23614 4.16473 7.76378 4.16473 8.08921 4.49017L13.0892 9.49017C13.4147 9.81561 13.4147 10.3432 13.0892 10.6687L8.08921 15.6687C7.76378 15.9941 7.23614 15.9941 6.9107 15.6687C6.58527 15.3432 6.58527 14.8156 6.9107 14.4902L11.3214 10.0794L6.9107 5.66868C6.58527 5.34325 6.58527 4.81561 6.9107 4.49017Z" />
                    </svg>',
                ));
                ?>
            </div>
        <?php endif; ?>
        </div>
        <div class="archive-page__posts--right">
            <div class="archive-page__posts--right--reglementary">
                <?php 
                $texte_reglementation = get_field('texte_reglementation_search', 'option');
                if ($texte_reglementation) {
                    echo $texte_reglementation;
                }
                ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>