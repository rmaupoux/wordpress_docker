<?php 

function render_block_post_link_wrapper ( $attributes, $content, $block ) {
    $class_names = 'wp-block-citeo-semantic-post-link-wrapper ' . ($attributes['className'] ?? '');
    
    if ( ! isset( $block->context['postId'] ) ) {
        return sprintf(
            '<div class="%s">%s</div>',
            esc_attr( $class_names ),
            $content
        );
    } 
    
    $post_id = $block->context['postId'];
    $url = $post_id ? get_permalink( $post_id ) : '#';
    
    return sprintf(
        '<a href="%s" class="%s">%s</a>',
        esc_url( $url ),
        esc_attr( $class_names ),
        $content
    );
};