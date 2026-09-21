<?php
/**
 * Shortcodes pour le template FSE "Blog Home" (home.html) : slider des
 * articles à la une et blocs d'articles récents groupés par catégorie.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Supprime les retours à la ligne entre balises pour éviter que wpautop
 * (filtre "the_content") n'insère des <p>/<br> parasites dans le HTML
 * généré par ces shortcodes.
 */
function am_post_refonte_html_compact( $html ) {
	return preg_replace( '/>\s+</', '><', trim( $html ) );
}

/**
 * Affiche la vignette d'un article dans une div donnée (structure réutilisée
 * pour bénéficier des styles .wp-block-post-featured-image de style.css).
 */
function am_post_refonte_vignette( $classe_conteneur = '' ) {
	if ( ! has_post_thumbnail() ) {
		return;
	}
	?>
	<div class="<?php echo esc_attr( $classe_conteneur ); ?>">
		<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'large' ); ?></a>
	</div>
	<?php
}

/**
 * Affiche les étiquettes (post_tag) de l'article courant.
 */
function am_post_refonte_etiquettes( $classe_conteneur ) {
	$etiquettes = get_the_terms( get_the_ID(), 'post_tag' );
	if ( ! $etiquettes || is_wp_error( $etiquettes ) ) {
		return;
	}
	?>
	<div class="<?php echo esc_attr( $classe_conteneur ); ?>">
		<?php foreach ( $etiquettes as $etiquette ) : ?>
			<a href="<?php echo esc_url( get_term_link( $etiquette ) ); ?>"><?php echo esc_html( $etiquette->name ); ?></a>
		<?php endforeach; ?>
	</div>
	<?php
}

/**
 * [am_home_slider count="5"] - Slider des derniers articles "à la une"
 * (articles épinglés/sticky ; à défaut, simplement les derniers publiés).
 */
add_shortcode( 'am_home_slider', function ( $atts ) {
	$atts = shortcode_atts( [ 'count' => 5 ], $atts );

	$ids_epingles = get_option( 'sticky_posts' );

	$args = [
		'post_type'           => 'post',
		'posts_per_page'      => (int) $atts['count'],
		'ignore_sticky_posts' => true,
	];

	if ( ! empty( $ids_epingles ) ) {
		$args['post__in'] = $ids_epingles;
		$args['orderby']  = 'post__in';
	} else {
		$args['orderby'] = 'date';
		$args['order']   = 'desc';
	}

	$requete = new WP_Query( $args );

	if ( ! $requete->have_posts() ) {
		return '';
	}

	ob_start();
	?>
	<div class="am-home-slider" data-am-home-slider>
		<div class="am-home-slider-track">
			<?php while ( $requete->have_posts() ) : $requete->the_post(); ?>
				<article class="am-home-slide">
					<?php am_post_refonte_vignette( 'am-home-slide-media' ); ?>
					<div class="am-home-slide-content">
						<span class="am-home-slide-badge">Highlight</span>
						<h3 class="am-home-slide-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p class="am-home-slide-date"><?php echo esc_html( get_the_date() ); ?></p>
						<div class="am-home-slide-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></div>
						<?php am_post_refonte_etiquettes( 'am-home-slide-tags' ); ?>
						<a class="am-home-slide-link" href="<?php the_permalink(); ?>">Read the article &rarr;</a>
					</div>
				</article>
			<?php endwhile; ?>
		</div>
		<?php if ( $requete->post_count > 1 ) : ?>
			<div class="am-home-slider-nav">
				<button type="button" class="am-home-slider-prev" aria-label="Article précédent">&larr;</button>
				<div class="am-home-slider-dots"></div>
				<button type="button" class="am-home-slider-next" aria-label="Article suivant">&rarr;</button>
			</div>
		<?php endif; ?>
	</div>
	<?php
	wp_reset_postdata();
	return am_post_refonte_html_compact( ob_get_clean() );
} );

/**
 * [am_home_categories per_page="3" exclude="non-classe,uncategorized"] -
 * Une section "Posts" par catégorie ayant des articles, avec une grille des
 * plus récents (réutilise les classes .am-activities-card de style.css).
 */
add_shortcode( 'am_home_categories', function ( $atts ) {
	$atts = shortcode_atts( [
		'per_page' => 3,
		'exclude'  => 'non-classe,uncategorized',
	], $atts );

	$slugs_exclus = array_filter( array_map( 'trim', explode( ',', $atts['exclude'] ) ) );
	$ids_exclus   = array_filter( array_map( function ( $slug ) {
		$terme = get_term_by( 'slug', $slug, 'category' );
		return $terme ? $terme->term_id : 0;
	}, $slugs_exclus ) );

	$categories = get_categories( [
		'hide_empty' => true,
		'exclude'    => $ids_exclus,
		'orderby'    => 'count',
		'order'      => 'desc',
	] );

	if ( empty( $categories ) ) {
		return '';
	}

	ob_start();
	foreach ( $categories as $categorie ) {
		$requete = new WP_Query( [
			'post_type'      => 'post',
			'posts_per_page' => (int) $atts['per_page'],
			'category__in'   => [ $categorie->term_id ],
			'orderby'        => 'date',
			'order'          => 'desc',
		] );

		if ( ! $requete->have_posts() ) {
			continue;
		}
		?>
		<div class="am-home-category-section">
			<div class="am-home-category-heading">
				<h2><?php echo esc_html( $categorie->name ); ?></h2>
				<a class="am-home-category-viewall" href="<?php echo esc_url( get_term_link( $categorie ) ); ?>">View all &rarr;</a>
			</div>
			<div class="am-home-category-grid">
				<?php while ( $requete->have_posts() ) : $requete->the_post(); ?>
					<div class="am-activities-card">
						<?php am_post_refonte_vignette( 'wp-block-post-featured-image' ); ?>
						<h3 class="am-activities-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p class="am-activities-card-date"><?php echo esc_html( get_the_date() ); ?></p>
						<div class="am-activities-card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></div>
						<?php am_post_refonte_etiquettes( 'am-activities-card-tags' ); ?>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
		<?php
		wp_reset_postdata();
	}
	return am_post_refonte_html_compact( ob_get_clean() );
} );
