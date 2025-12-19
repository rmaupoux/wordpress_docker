<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://v2.citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Articles
 * @subpackage Citeo_Articles/public/partials
 */
?>

<?php
    $temps_de_lecture = get_field('temps_de_lecture');
    // $copylink = get_field('copylink_post', 'options');
    $sous_titre = get_field('sous_titre_articles');

?>

<?php get_header(); ?>
<main class="single">

    <div class='article-content'>
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <?php 
            $blog_page_id = get_option('page_for_posts');
            $blog_url = $blog_page_id ? get_permalink($blog_page_id) : home_url('/le-mag/');
            ?>
            <div class="wrapper-back-to-mag">
                <a href="<?php echo esc_url($blog_url); ?>" class='back-to-mag'><?php _e('Retour à toutes les actualités', 'citeo'); ?></a>
            </div>

            <?php 
            // $sous_titre = get_field('sous_titre_articles');
            if (!empty($sous_titre)) : ?>
                <div class="sub-post-title ds-display-1"><?php echo esc_html($sous_titre); ?></div>
            <?php endif; ?>

            <h1 class="post-title ds-heading-1"><?php the_title(); ?></h1>
            
            <div class='article-content__infos'>
                <span class="article-content__post-date">
                    <?php echo get_the_date('j F Y'); ?>
                </span>

                <?php if (!empty($temps_de_lecture)) : ?>
                    <div class="article-content__lecture-info">
                        <div class="article-content__lecture-info--chrono">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <g>
                                    <path d="M2 8.5C2 9.68669 2.35189 10.8467 3.01118 11.8334C3.67047 12.8201 4.60754 13.5892 5.7039 14.0433C6.80026 14.4974 8.00666 14.6162 9.17054 14.3847C10.3344 14.1532 11.4035 13.5818 12.2426 12.7426C13.0818 11.9035 13.6532 10.8344 13.8847 9.67054C14.1162 8.50666 13.9974 7.30026 13.5433 6.2039C13.0892 5.10754 12.3201 4.17047 11.3334 3.51118C10.3467 2.85189 9.18669 2.5 8 2.5C6.32263 2.50631 4.71265 3.16082 3.50667 4.32667L2 5.83333M2 5.83333V2.5M2 5.83333H5.33333M8 5.16667V8.5L10.6667 9.83333" stroke="#6B7280" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                            </svg>
                            <span>~<?php echo esc_html($temps_de_lecture); ?> min. de lecture</span>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="article-content__social-share">
                    <a href="#" 
                        data-platform="copylink" 
                        class="copylink-button"
                        role="button"
                        aria-label="<?php _e('Copier le lien de cet article dans le presse-papiers', 'citeo'); ?>"
                        title="<?php _e('Copier le lien', 'citeo'); ?>"
                        tabindex="0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                            <path d="M8.18978 10.9039C8.57848 11.4235 9.0744 11.8535 9.64388 12.1646C10.2134 12.4758 10.8431 12.6608 11.4904 12.7071C12.1377 12.7535 12.7874 12.6601 13.3954 12.4333C14.0034 12.2065 14.5555 11.8516 15.0143 11.3926L17.7296 8.6773C18.554 7.82378 19.0101 6.68061 18.9998 5.49403C18.9895 4.30745 18.5136 3.17239 17.6745 2.33331C16.8354 1.49424 15.7004 1.01829 14.5138 1.00798C13.3272 0.997672 12.184 1.45382 11.3305 2.27819L9.77372 3.82592M11.8102 9.09365C11.4215 8.574 10.9256 8.14403 10.3561 7.83289C9.78663 7.52175 9.15688 7.33673 8.5096 7.29037C7.86232 7.24402 7.21264 7.33741 6.60462 7.56422C5.99661 7.79102 5.44449 8.14594 4.9857 8.60489L2.27037 11.3202C1.44601 12.1737 0.98986 13.3169 1.00017 14.5035C1.01048 15.6901 1.48643 16.8251 2.3255 17.6642C3.16457 18.5033 4.29964 18.9792 5.48622 18.9895C6.6728 18.9998 7.81596 18.5437 8.66949 17.7193L10.2172 16.1716" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="sr-only"><?php _e('Copier le lien', 'citeo'); ?></span>
                    </a>
                </div>
            </div>

            <div class='article-content__exergue'>
                <?php the_excerpt(); ?>
            </div>
            
            <div class="article-content__image">
                <?php 
                    if (has_post_thumbnail()) {
                        the_post_thumbnail('large'); 

                        $thumbnail_id = get_post_thumbnail_id();
                        $caption = !empty($thumbnail_id) ? wp_get_attachment_caption($thumbnail_id) : '';
                        if (!empty($caption)) {
                            echo "<p class='caption'>" . esc_html($caption) . "</p>";
                        }
                    }
                ?>
            </div>

            <?php the_content(); ?>

        <?php endwhile; endif; ?>
    </div>
</main>
<?php get_footer(); ?>