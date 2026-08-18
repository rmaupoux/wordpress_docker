<?php
/**
 * Helpers utilisables comme "helper" de magic tag Pods dans les templates
 * (syntaxe {@field,helper_name,before,after} — before/after ne sont
 * affichés que si le helper renvoie une valeur non vide).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renvoie une coche si le champ boolean est vrai, une chaîne vide sinon.
 *
 * Pods ne traite pas un boolean_no_label vide comme une chaîne vide : sans
 * label configuré il retombe sur la valeur brute stockée ("0"), qui reste
 * "non vide" pour le moteur de magic tags (is_numeric("0") est vrai). On
 * passe donc par ce helper pour obtenir un vrai/faux PHP fiable.
 */
function annuaire_bateau_checked( $value ) {
	return $value ? '✓' : '';
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_checked';

	return $allowed;
} );

/**
 * Affiche le nombre de places d'amarrage ("docking") de la fiche annuaire
 * maritime, uniquement si le champ est strictement positif.
 *
 * Appelé comme helper de magic tag Pods : {@docking,annuaire_maritime_docking_label}.
 */
function annuaire_maritime_docking_label( $value ) {
	$docking = (int) $value;

	if ( $docking <= 0 ) {
		return '';
	}

	return sprintf( 'Number of berth: %d', $docking );
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_maritime_docking_label';

	return $allowed;
} );

/**
 * Génère un accordéon par groupe de champs Pods du pod "annuaire_bateau"
 * (sauf le groupe technique "Plus de champs"), contenant les champs
 * Yes/No cochés du groupe.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_bateau_equipment_accordions}.
 * Contrairement au reste du template (champs fixes), ceci lit la structure
 * des groupes/champs directement depuis Pods : ajouter un groupe ou un champ
 * Yes/No dans l'admin Pods suffit à le faire apparaître ici, sans toucher au
 * template.
 */
function annuaire_bateau_equipment_accordions( $id ) {
	$id = (int) $id;

	if ( ! $id ) {
		return '';
	}

	$pod_data = pods_api()->load_pod( array( 'name' => 'annuaire_bateau' ) );

	if ( empty( $pod_data['groups'] ) ) {
		return '';
	}

	$bateau = pods( 'annuaire_bateau', $id );
	$html   = '';

	foreach ( $pod_data['groups'] as $group ) {
		if ( 'plus_de_champs' === $group['name'] ) {
			continue;
		}

		$items = '';

		foreach ( $group['fields'] as $field ) {
			if ( 'boolean' !== $field['type'] ) {
				continue;
			}

			if ( ! $bateau->field( $field['name'] ) ) {
				continue;
			}

			$items .= sprintf(
				'<div class="ab-fiche-bateau-equip-item"><span class="ab-fiche-bateau-equip-check">✓</span> %s</div>',
				esc_html( $field['label'] )
			);
		}

		if ( '' === $items ) {
			continue;
		}

		$html .= sprintf(
			'<details class="ab-fiche-bateau-accordion"><summary>%s</summary><div class="ab-fiche-bateau-accordion-content ab-fiche-bateau-equip-grid">%s</div></details>',
			esc_html( mb_strtoupper( $group['label'], 'UTF-8' ) ),
			$items
		);
	}

	return $html;
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_equipment_accordions';

	return $allowed;
} );

/**
 * Génère la liste des champs (label/valeur) du groupe Pods "Engine" du pod
 * "annuaire_bateau", un <li> par champ renseigné (style .ab-fiche-bateau-specs).
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_bateau_engine_specs}.
 * Comme pour annuaire_bateau_equipment_accordions, la structure est lue
 * directement depuis Pods : ajouter un champ au groupe "Engine" dans l'admin
 * Pods suffit à le faire apparaître ici, sans toucher au template.
 */
function annuaire_bateau_engine_specs( $id ) {
	$id = (int) $id;

	if ( ! $id ) {
		return '';
	}

	$pod_data = pods_api()->load_pod( array( 'name' => 'annuaire_bateau' ) );

	if ( empty( $pod_data['groups'] ) ) {
		return '';
	}

	$engine_group = null;

	foreach ( $pod_data['groups'] as $group ) {
		if ( 'engine' === $group['name'] ) {
			$engine_group = $group;
			break;
		}
	}

	if ( ! $engine_group ) {
		return '';
	}

	$bateau = pods( 'annuaire_bateau', $id );
	$items  = '';

	foreach ( $engine_group['fields'] as $field ) {
		$value = $bateau->display( $field['name'] );

		if ( '' === $value || null === $value ) {
			continue;
		}

		$items .= sprintf(
			'<li><span class="ab-fiche-bateau-specs-label">%s</span><span class="ab-fiche-bateau-specs-value">%s</span></li>',
			esc_html( $field['label'] ),
			esc_html( $value )
		);
	}

	return $items;
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_engine_specs';

	return $allowed;
} );

/**
 * Compte les fiches "annuaire_bateau" publiées dont le champ Relationship
 * contact_assoc pointe vers la fiche "annuaire_maritime" $id.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_maritime_boat_count}.
 * Calculé à partir de la relation réelle plutôt que du champ manuel
 * "nombre_de_bateaux", qui peut être désynchronisé.
 */
function annuaire_maritime_boat_count( $id ) {
	$id = (int) $id;

	if ( ! $id ) {
		return 0;
	}

	$query = new WP_Query( [
		'post_type'      => 'annuaire_bateau',
		'post_status'    => 'publish',
		'fields'         => 'ids',
		'posts_per_page' => 1,
		'no_found_rows'  => false,
		'meta_query'     => [
			[
				'key'   => 'contact_assoc',
				'value' => $id,
			],
		],
	] );

	return $query->found_posts;
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_maritime_boat_count';

	return $allowed;
} );

/**
 * Affiche le nombre de bateaux de la fiche annuaire maritime, uniquement si
 * strictement positif.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_maritime_boat_count_label}.
 */
function annuaire_maritime_boat_count_label( $id ) {
	$count = annuaire_maritime_boat_count( $id );

	if ( $count <= 0 ) {
		return '';
	}

	return sprintf( 'Listing boats: %d', $count );
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_maritime_boat_count_label';

	return $allowed;
} );

/**
 * Génère la grille de fiches "annuaire_bateau" (mêmes markup/classes que la
 * grille de résultats de la page d'accueil : #ab-results-grid / .ab-yacht-card,
 * voir includes/shortcodes/bateaux.php et js/script.js) pour les bateaux dont
 * le champ Relationship contact_assoc pointe vers la fiche "annuaire_maritime"
 * $id.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_maritime_boats_grid}.
 * Contrairement à la page d'accueil (peuplée en JS via l'API REST), ici les
 * bateaux du contact sont connus côté serveur, donc la grille est rendue
 * directement en PHP.
 */
function annuaire_maritime_boats_grid( $id ) {
	$id = (int) $id;

	if ( ! $id ) {
		return '';
	}

	$query = new WP_Query( [
		'post_type'      => 'annuaire_bateau',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'meta_query'     => [
			[
				'key'   => 'contact_assoc',
				'value' => $id,
			],
		],
	] );

	if ( ! $query->have_posts() ) {
		return '';
	}

	$cards = '';

	foreach ( $query->posts as $post ) {
		$titre    = get_post_meta( $post->ID, 'model', true ) ?: $post->post_title;
		$prix     = intval( get_post_meta( $post->ID, 'asking_price', true ) );
		$localisation = get_post_meta( $post->ID, 'town', true ) ?: 'Location';
		$image_url = get_the_post_thumbnail_url( $post->ID, 'medium_large' ) ?: get_the_post_thumbnail_url( $post->ID, 'full' );

		if ( ! $image_url ) {
			$image_url = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3C/svg%3E";
		}

		$cards .= sprintf(
			'<div class="ab-yacht-card">
				<div class="ab-yacht-image">
					<img src="%1$s" alt="%2$s">
				</div>
				<div class="ab-yacht-body">
					<h3 class="ab-yacht-title">%2$s</h3>
					<p class="ab-yacht-price">%3$s&nbsp;$</p>
					<div class="ab-yacht-location">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
						<span>%4$s</span>
					</div>
					<a href="%5$s" class="ab-yacht-btn">More Information</a>
				</div>
			</div>',
			esc_url( $image_url ),
			esc_html( $titre ),
			esc_html( number_format_i18n( $prix ) ),
			esc_html( $localisation ),
			esc_url( get_permalink( $post->ID ) )
		);
	}

	return sprintf(
		'<div class="annuaire-yachts-section"><h2 class="annuaire-yachts-title">Yachts for sale</h2><div id="ab-results-grid" class="ab-results-grid">%s</div></div>',
		$cards
	);
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_maritime_boats_grid';

	return $allowed;
} );

/**
 * Génère le carrousel "FEATURED YACHTS" (mêmes markup/classes que le
 * carrousel de la page d'accueil : .ab-featured-section / .ab-yacht-card,
 * voir includes/shortcodes/bateaux.php et js/script.js) pour la fiche
 * bateau $id.
 *
 * Appelé comme helper de magic tag Pods : {@ID,annuaire_bateau_featured_carousel}.
 * La page d'accueil peuple ce carrousel en JS via l'API REST /a-la-une, mais
 * ce script (script.js) plante avant d'y arriver sur la fiche bateau (il
 * suppose la présence du formulaire de recherche, absent ici). On rend donc
 * les slides directement en PHP, avec un petit script autonome (sans lien
 * avec script.js) pour la navigation prev/next/dots.
 */
function annuaire_bateau_featured_carousel( $id ) {
	$id = (int) $id;

	$query = new WP_Query( [
		'post_type'      => 'annuaire_bateau',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'post__not_in'   => $id ? [ $id ] : [],
		'meta_query'     => [
			[
				'key'   => 'a_la_une',
				'value' => '1',
			],
		],
	] );

	if ( ! $query->have_posts() ) {
		return '';
	}

	$slides = array_chunk( $query->posts, 4 );
	$slides_html = [];

	foreach ( $slides as $slide ) {
		$cards = '';

		foreach ( $slide as $post ) {
			$titre        = get_post_meta( $post->ID, 'model', true ) ?: $post->post_title;
			$prix         = intval( get_post_meta( $post->ID, 'asking_price', true ) );
			$localisation = get_post_meta( $post->ID, 'town', true ) ?: 'Location';
			$image_url    = get_the_post_thumbnail_url( $post->ID, 'medium_large' ) ?: get_the_post_thumbnail_url( $post->ID, 'full' );

			if ( ! $image_url ) {
				$image_url = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3C/svg%3E";
			}

			$cards .= sprintf(
				'<div class="ab-yacht-card">
					<div class="ab-yacht-image">
						<img src="%1$s" alt="%2$s">
						<div class="ab-featured-badge">Featured</div>
					</div>
					<div class="ab-yacht-body">
						<h3 class="ab-yacht-title">%2$s</h3>
						<p class="ab-yacht-price">%3$s&nbsp;$</p>
						<div class="ab-yacht-location">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>%4$s</span>
						</div>
						<a href="%5$s" class="ab-yacht-btn">More Information</a>
					</div>
				</div>',
				esc_url( $image_url ),
				esc_html( $titre ),
				esc_html( number_format_i18n( $prix ) ),
				esc_html( $localisation ),
				esc_url( get_permalink( $post->ID ) )
			);
		}

		$slides_html[] = $cards;
	}

	$has_multiple_slides = count( $slides_html ) > 1;
	$slider_div          = sprintf( '<div class="ab-featured-slider" id="ab-fbc-slider">%s</div>', $slides_html[0] );
	$dots_div             = '';

	if ( $has_multiple_slides ) {
		$prev_btn = '<button type="button" class="ab-featured-nav ab-featured-prev" id="ab-fbc-prev" aria-label="Previous" disabled>&lsaquo;</button>';
		$next_btn = '<button type="button" class="ab-featured-nav ab-featured-next" id="ab-fbc-next" aria-label="Next">&rsaquo;</button>';

		$dots = '';

		foreach ( $slides_html as $i => $slide_html ) {
			$dots .= sprintf(
				'<button type="button" class="ab-featured-dot%s" data-slide="%d"></button>',
				0 === $i ? ' active' : '',
				$i
			);
		}

		$dots_div = sprintf( '<div class="ab-featured-dots" id="ab-fbc-dots">%s</div>', $dots );
		$body     = $prev_btn . $slider_div . $next_btn;
	} else {
		$body = $slider_div;
	}

	$html = sprintf(
		'<div class="ab-featured-section">
			<h2 class="ab-featured-title">FEATURED YACHTS</h2>
			<div class="ab-featured-slider-wrapper">
				%s
			</div>
			%s
		</div>',
		$body,
		$dots_div
	);

	if ( $has_multiple_slides ) {
		$html .= sprintf(
			'<script>
			(function () {
				var slides = %s;
				var index = 0;
				var slider = document.getElementById( "ab-fbc-slider" );
				var prevBtn = document.getElementById( "ab-fbc-prev" );
				var nextBtn = document.getElementById( "ab-fbc-next" );
				var dotsWrap = document.getElementById( "ab-fbc-dots" );

				if ( ! slider || ! dotsWrap ) {
					return;
				}

				function render() {
					slider.innerHTML = slides[ index ];
					prevBtn.disabled = index === 0;
					nextBtn.disabled = index === slides.length - 1;
					dotsWrap.querySelectorAll( ".ab-featured-dot" ).forEach( function ( dot, i ) {
						dot.classList.toggle( "active", i === index );
					} );
				}

				prevBtn.addEventListener( "click", function () {
					if ( index > 0 ) { index--; render(); }
				} );
				nextBtn.addEventListener( "click", function () {
					if ( index < slides.length - 1 ) { index++; render(); }
				} );
				dotsWrap.querySelectorAll( ".ab-featured-dot" ).forEach( function ( dot, i ) {
					dot.addEventListener( "click", function () {
						index = i;
						render();
					} );
				} );
			})();
			</script>',
			wp_json_encode( array_values( $slides_html ) )
		);
	}

	return $html;
}

add_filter( 'pods_helper_allowed_callbacks', function ( $allowed ) {
	$allowed[] = 'annuaire_bateau_featured_carousel';

	return $allowed;
} );
