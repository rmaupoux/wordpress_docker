<?php get_header(); ?>

<main class="article-home">
	<!-- <?php the_breadcrumb() ?> -->

	<div class="container">
		<?php $posts_page_id = get_option( 'page_for_posts' );

        if ( $posts_page_id ) {
            $page = get_post( $posts_page_id );

            if ( $page ) {
                echo apply_filters( 'the_content', $page->post_content );
            }
        } ?>
	</div>
	
</main>

<?php get_footer(); ?>