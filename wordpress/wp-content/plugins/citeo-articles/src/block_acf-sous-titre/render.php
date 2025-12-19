<?php
/**
 * Render callback for ACF Sous-titre block
 */

if (!function_exists('render_acf_sous_titre_block')) {
    function render_acf_sous_titre_block($attributes, $content, $block) {
        // Récupération du post ID depuis le contexte du block
        $post_id = null;
        
        if (isset($block->context['postId'])) {
            $post_id = $block->context['postId'];
        } else {
            $post_id = get_the_ID();
        }
        
        if (!$post_id) {
            return '';
        }
        
        // Récupération du champ ACF
        $sous_titre = get_field('sous_titre_articles', $post_id);
        
        if (empty($sous_titre)) {
            return '';
        }
        
        // Classes CSS
        $classes = 'wp-block-citeo-articles-acf-sous-titre';
        if (!empty($attributes['className'])) {
            $classes .= ' ' . esc_attr($attributes['className']);
        }
        
        return sprintf(
            '<div class="%s">%s</div>',
            esc_attr($classes),
            esc_html($sous_titre)
        );
    }
}