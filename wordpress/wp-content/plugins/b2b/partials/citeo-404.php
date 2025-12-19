<?php get_header(); ?>

<main class="page-404">

    <div class="container">
        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="135" viewBox="0 0 86 135" fill="none">
            <path class="page-404--color" d="M41.1874 98.5085C51.1659 98.5085 59.2845 106.626 59.2847 116.604C59.2847 121.193 57.5635 125.571 54.4384 128.93L50.3382 125.116C52.4956 122.796 53.6831 119.775 53.6831 116.604C53.6828 109.714 48.0765 104.107 41.1859 104.107C34.2953 104.107 28.6905 109.714 28.6902 116.604C28.6902 123.495 34.2971 129.101 41.1859 129.101C41.9562 129.101 42.7265 129.031 43.4751 128.893L44.4952 134.398C43.4106 134.6 42.2962 134.7 41.1859 134.7C31.2082 134.699 23.0917 126.582 23.0917 116.604C23.092 106.626 31.2092 98.5088 41.1874 98.5085Z" />
            <path class="page-404--color" d="M43.9859 0.299988C55.0076 0.299988 65.3829 4.2297 73.1982 11.3655L73.2028 11.3686C81.0892 18.5674 85.4322 28.1619 85.4323 38.3814C85.4323 46.7675 82.5258 54.7191 77.026 61.3806C72.1859 67.2421 65.486 71.753 57.9907 74.2323V92.7026H24.3903V74.7818H29.992V87.101H52.3922V70.0253L54.4477 69.4572C61.6701 67.4639 68.1559 63.3295 72.7075 57.816C77.3679 52.1718 79.8307 45.4499 79.8307 38.3814C79.8304 20.4711 63.752 5.9016 43.9906 5.9016C28.8459 5.90163 12.923 17.0721 7.70159 21.0766L18.5782 41.0452C23.612 36.7523 34.7019 28.3019 43.989 28.3019C51.33 28.302 55.8888 32.1115 55.8888 38.2436C55.8888 41.8352 54.2435 44.8287 50.9976 47.1421C48.4611 48.9475 45.1916 50.1952 42.031 51.4002C34.538 54.2587 29.9877 56.3929 29.9873 61.9022V64.7023H24.3872V61.9022C24.3877 52.1376 33.0627 48.8291 40.0343 46.1701C46.3914 43.7442 50.2871 42.0642 50.2872 38.2436C50.2872 36.3514 49.4873 35.5467 48.8848 35.1061C47.8081 34.3199 46.1136 33.9035 43.9859 33.9035C39.9973 33.9038 34.5942 36.2008 28.3636 40.5468C23.4527 43.9726 19.7944 47.462 19.7468 47.5089L17.1031 50.0443L0.567627 19.6913L2.29965 18.2177C3.15902 17.4848 23.5904 0.300408 43.9859 0.299988Z" />
        </svg>
        
            <?php
            // Affiche le contenu de la page avec le slug 404 si elle existe
            $post_404 = get_page_by_path( '404-page', OBJECT, 'page' );
            if ( $post_404 ) {
                echo apply_filters( 'the_content', $post_404->post_content );
            } else {
                // Fallback : contenu statique par défaut
            ?>  <div class="404-page__heading">
                    <h1 class="ds-heading-1 ds-citeo-heading-heading-tag"><?php _e('Oups 404', 'citeo'); ?></h1>
                    <p class="ds-heading-3 ds-citeo-heading-heading-tag"><?php _e('Page introuvable', 'citeo'); ?></p>
                </div>
                <div class="wp-block-buttons">
                    <?php
                        // Bouton retour à l'accueil (toujours affiché)
                        $home_url = esc_url( home_url( '/' ) );
                        $site_name = get_bloginfo( 'name' );
                        printf(
                            '<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="%s">%s %s</a></div>',
                            $home_url,
                            esc_html__( 'Retour à l\'accueil', 'citeo' ),
                            esc_html( $site_name )
                        );

                        // Bouton vers la page de liste des articles (conditionnel)
                        $blog_url = get_permalink( get_option( 'page_for_posts' ) );
                        if ( $blog_url ) {
                            printf(
                                '<div class="wp-block-button is-style-secondary"><a class="wp-block-button__link wp-element-button" href="%s">%s</a></div>',
                                esc_url( $blog_url ),
                                esc_html__( 'Voir tous les articles', 'citeo' )
                            );
                        }
                    ?>
                </div>
                
        <?php } ?>
    </div>

</main>

<?php get_footer(); ?>




