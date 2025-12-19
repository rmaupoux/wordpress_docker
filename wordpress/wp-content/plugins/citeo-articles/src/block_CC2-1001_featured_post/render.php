<?php
/**
 * Rendu côté frontend du bloc encart article
 */

if (!$attributes['postId']) {
    return '';
}

$post_id = $attributes['postId'];
$post = get_post($post_id);

if (!$post) {
    return '';
}

// Récupération des données du post
$post_title = get_the_title($post_id);
$post_link = get_permalink($post_id);
$post_date = get_the_date('j F Y', $post_id);
$post_subtitle = get_field('sous_titre_articles', $post_id);
$custom_text = $attributes['customText'] ?? '';
$card_row = $attributes['cardRow'] ?? false;

// Image à la une ou image externe
$external_image = get_post_meta($post_id, 'external_featured_image', true);
if ($external_image) {
    $post_image = $external_image;
} else {
    $post_image = get_the_post_thumbnail_url($post_id, 'medium');
}

// Classes CSS
$classes = 'wp-block-encart-article';
if ($card_row) {
    $classes .= ' card-row';
}
?>

<section class="<?php echo esc_attr($classes); ?>">
    <?php if (!$card_row && $custom_text): ?>
        <div class="ds-text-xsmall"><?php echo wp_kses_post($custom_text); ?></div>
    <?php endif; ?>
    <a href="<?php echo esc_url($post_link); ?>">
        <div class="display-one-post-frontend">
            <?php if ($post_image): ?>
                <div class="display-one-post-frontend--image">
                    <img src="<?php echo esc_url($post_image); ?>" alt="<?php echo esc_attr($post_title); ?>">
                </div>
            <?php endif; ?>
            
            <div class="display-one-post-frontend--text">
                <?php if ($post_subtitle): ?>
                    <div class="ds-display-2"><?php echo esc_html($post_subtitle); ?></div>
                <?php endif; ?>
                
                <h3 class="ds-heading-4">
                    <?php echo esc_html($post_title); ?>
                </h3>
                
                <div class="post-date"><?php echo esc_html($post_date); ?></div>
                
            </div>
        </div>
    </a>
</section>