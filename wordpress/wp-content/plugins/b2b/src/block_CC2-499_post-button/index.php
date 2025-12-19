<?php 

// Render the block server side to access ACF field from posts, here we render the post button
function render_block_post_button( $attributes, $content, $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	/**
	 * The `$post` argument is intentionally omitted so that changes are reflected when previewing a post.
	 * See: https://github.com/WordPress/gutenberg/pull/37622#issuecomment-1000932816.
	*/

    $tag_name = 'div';
	$content = '';
	$link = get_field("article_url", $block->context['postId']);
	$target = esc_attr( $attributes['linkTarget'] );

	if(!$link) {
		$link = get_the_permalink();
		$target = '';
	}
    if (isset($attributes['buttonText'] )) {
		$content = $attributes['buttonText'];
        $inner_classes = 'wp-block-button__link wp-element-button';

        $content = sprintf( '<a href="%1$s" target="_blank" class="%3$s">%4$s</a>', esc_url( $link ), $target, $inner_classes, $content );
    }

	// 30/1/2025 : Wordpress generic classes are not used yet as the option isn't hooked on the block yet
	$classes = array();
	if ( isset( $attributes['textAlign'] ) ) {
		$classes[] = 'has-text-align-' . $attributes['textAlign'];
	}
	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classes[] = 'has-link-color';
	}

    // Emulate a core/button with these classes
    $classes[] = 'is-style-tertiary has-suffix--Arrow-right wp-block-button';
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );


	return sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		$tag_name,
		$wrapper_attributes,
		$content
	);
}