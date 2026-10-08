<?php
/**
 * Shortcode [annuaire_tabs] - Affiche les onglets YACHT / CHARTER / NETWORK
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Récupère les options "value|Label" d'un champ Pods de type pick / custom-simple
 * (ex: Season, Duration du groupe Charter Specification) sous forme value => label.
 */
function ab_tabs_get_pick_custom_options( $field_name ) {
	global $wpdb;

	$field_id = $wpdb->get_var( $wpdb->prepare(
		"SELECT p.ID FROM {$wpdb->posts} p
		INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = 'type' AND pm.meta_value = 'pick'
		WHERE p.post_type = '_pods_field' AND p.post_name = %s
		LIMIT 1",
		$field_name
	) );

	if ( ! $field_id ) {
		return array();
	}

	$custom  = get_post_meta( $field_id, 'pick_custom', true );
	$options = array();

	foreach ( preg_split( '/\r\n|\r|\n/', trim( (string) $custom ) ) as $ligne ) {
		$ligne = trim( trim( $ligne, '|' ) );

		if ( '' === $ligne ) {
			continue;
		}

		$parts = explode( '|', $ligne, 2 );
		$value = trim( $parts[0] );
		$label = isset( $parts[1] ) ? trim( $parts[1] ) : $value;

		$options[ $value ] = $label;
	}

	return $options;
}

/**
 * Destinations (villes) distinctes des bateaux proposés en charter
 * (taxonomie AB_TAXONOMIE_ACHAT, terme "rent", champ "town").
 */
function ab_tabs_get_charter_destinations() {
	global $wpdb;

	$villes = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT pm.meta_value
		FROM {$wpdb->postmeta} pm
		INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		INNER JOIN {$wpdb->term_relationships} tr ON tr.object_id = p.ID
		INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
		INNER JOIN {$wpdb->terms} t ON t.term_id = tt.term_id
		WHERE pm.meta_key = 'town'
		AND pm.meta_value != ''
		AND p.post_type = %s
		AND p.post_status = 'publish'
		AND tt.taxonomy = %s
		AND t.slug = 'rent'
		ORDER BY pm.meta_value ASC",
		AB_CPT_NAME,
		AB_TAXONOMIE_ACHAT
	) );

	return array_values( array_unique( array_filter( (array) $villes ) ) );
}

add_shortcode( 'annuaire_tabs', function () {
	$destinations = ab_tabs_get_charter_destinations();
	$saisons      = ab_tabs_get_pick_custom_options( 'seasonid' );
	$durees       = ab_tabs_get_pick_custom_options( 'duration' );

	ob_start();
	?>
	<div class="ab-tabs-container">
		<!-- Tabs Navigation -->
		<div class="ab-tabs-nav">
			<button class="ab-tab-btn ab-tab-active" data-tab="yacht">YACHT</button>
			<button class="ab-tab-btn" data-tab="charter">NETWORK</button>
			<button class="ab-tab-btn" data-tab="network">CHARTER</button>
		</div>

		<!-- Tabs Content -->
		<div class="ab-tabs-content">
			<!-- YACHT Tab -->
			<div class="ab-tab-pane ab-tab-active" id="ab-tab-yacht">
				<?php echo do_shortcode( '[annuaire_bateaux_recherche]' ); ?>
			</div>

			<!-- CHARTER Tab -->
			<div class="ab-tab-pane" id="ab-tab-charter">
				<?php echo do_shortcode( '[annuaire_recherche]' ); ?>
			</div>

			<!-- NETWORK Tab -->
			<div class="ab-tab-pane" id="ab-tab-network">
				<div class="ab-search-section">
					<div class="ab-search-container">
					<div class="ab-filters-container">
						<div class="ab-charter-fields-grid">

								<!-- Destination -->
								<div class="ab-charter-field">
									<label class="ab-charter-field-label">Destination</label>
									<div class="ab-select-wrapper">
										<select id="ab-charter-destination-select" class="ab-select-native">
											<option value="">Any</option>
											<?php foreach ( $destinations as $ville ) : ?>
												<option value="<?php echo esc_attr( $ville ); ?>"><?php echo esc_html( $ville ); ?></option>
											<?php endforeach; ?>
										</select>
										<span class="ab-select-trigger">Any</span>
										<ul class="ab-select-options" id="ab-charter-destination-options"></ul>
									</div>
								</div>

								<!-- Season -->
								<div class="ab-charter-field">
									<label class="ab-charter-field-label">Season</label>
									<div class="ab-select-wrapper">
										<select id="ab-charter-season-select" class="ab-select-native">
											<option value="">Select Season</option>
											<?php foreach ( $saisons as $valeur => $libelle ) : ?>
												<option value="<?php echo esc_attr( $valeur ); ?>"><?php echo esc_html( $libelle ); ?></option>
											<?php endforeach; ?>
										</select>
										<span class="ab-select-trigger">Select Season</span>
										<ul class="ab-select-options" id="ab-charter-season-options"></ul>
									</div>
								</div>

								

								<!-- Guests -->
								<div class="ab-charter-field">
									<label class="ab-charter-field-label">Guests</label>
									<div class="ab-number-input">
										<input type="number" id="ab-charter-guests" name="guests_charter" placeholder="Guests" min="1" max="100" step="1">
										<div class="ab-spinners">
											<button class="ab-spinner-btn" data-action="increment"></button>
											<button class="ab-spinner-btn" data-action="decrement"></button>
										</div>
									</div>
								</div>

								<!-- Duration -->
								<div class="ab-charter-field">
									<label class="ab-charter-field-label">Duration</label>
									<div class="ab-select-wrapper">
										<select id="ab-charter-duration-select" class="ab-select-native">
											<option value="">Select Duration</option>
											<?php foreach ( $durees as $valeur => $libelle ) : ?>
												<option value="<?php echo esc_attr( $valeur ); ?>"><?php echo esc_html( $libelle ); ?></option>
											<?php endforeach; ?>
										</select>
										<span class="ab-select-trigger">Select Duration</span>
										<ul class="ab-select-options" id="ab-charter-duration-options"></ul>
									</div>
								</div>

								<!-- Price -->
								<div class="ab-filter-box ab-charter-price-box">
									<div class="ab-filter-header">
										<label class="ab-filter-label">Price</label>
										<div class="ab-select-wrapper">
											<select id="ab-charter-currency-select" class="ab-select-native">
												<option value="EUR">EUR</option>
												<option value="USD">USD</option>
												<option value="GBP">GBP</option>
												<option value="CHF">CHF</option>
												<option value="AED">AED</option>
											</select>
											<span class="ab-select-trigger ab-select-trigger--currency">EUR</span>
											<ul class="ab-select-options" id="ab-charter-currency-options"></ul>
										</div>
									</div>

									<div class="ab-number-group">
										<div class="ab-number-input">
											<input type="number" id="ab-charter-price-min" placeholder="Min" min="0" max="100000000">
											<div class="ab-spinners">
												<button class="ab-spinner-btn" data-action="increment"></button>
												<button class="ab-spinner-btn" data-action="decrement"></button>
											</div>
										</div>
										<div class="ab-number-input">
											<input type="number" id="ab-charter-price-max" placeholder="Max" min="0" max="100000000">
											<div class="ab-spinners">
												<button class="ab-spinner-btn" data-action="increment"></button>
												<button class="ab-spinner-btn" data-action="decrement"></button>
											</div>
										</div>
									</div>
								</div>

							</div>

						<!-- Search Button -->
						<div class="ab-button-container">
							<button id="ab-charter-search-btn" style="margin-left:0" class="ab-search-btn" type="button">SEARCH CHARTER</button>
						</div>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
} );
