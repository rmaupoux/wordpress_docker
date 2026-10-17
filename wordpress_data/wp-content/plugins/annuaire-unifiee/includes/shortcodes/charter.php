<?php
/**
 * Shortcode [annuaire_bateaux_filtres_charter] : page de filtres dédiée aux
 * bateaux en location (taxonomie AB_TAXONOMIE_ACHAT, terme "rent") — colonne
 * de filtres à gauche, résultats instantanés sous forme de cartes à droite.
 * Même structure que [annuaire_bateaux_filtres_equipements] (bateaux-equipements.php),
 * réduite aux 6 filtres propres au charter : Destination, Season, Guests,
 * Duration, Minimum Price, Maximum Price (ces 2 derniers étant les champs
 * Pods "charter_price_min"/"charter_price_max" du groupe "Charter Specification").
 *
 * C'est la page vers laquelle redirige le bouton "SEARCH CHARTER" du
 * formulaire de recherche de [annuaire_tabs] (voir includes/shortcodes/tabs.php
 * et js/script.js), avec les filtres renseignés transmis en GET — lus ici au
 * chargement par js/charter-filtres.js (prefillDepuisURL).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_shortcode( 'annuaire_bateaux_filtres_charter', function () {
	// Réutilise les helpers déjà définis par le formulaire de recherche
	// [annuaire_tabs] (includes/shortcodes/tabs.php), toujours chargé par le
	// plugin : mêmes listes Destination/Season/Duration que la landing page.
	$destinations = function_exists( 'ab_tabs_get_charter_destinations' ) ? ab_tabs_get_charter_destinations() : array();
	$saisons      = function_exists( 'ab_tabs_get_pick_custom_options' ) ? ab_tabs_get_pick_custom_options( 'seasonid' ) : array();
	$durees       = function_exists( 'ab_tabs_get_pick_custom_options' ) ? ab_tabs_get_pick_custom_options( 'duration' ) : array();

	ob_start();
	?>
	<div class="abe-filtres" id="abc-root">

		<div class="abe-sidebar-col">

		<aside class="abe-sidebar">
			<div class="abe-sidebar-header">
				<h2 class="abe-sidebar-title">Filters</h2>
			</div>

			<details class="abe-groupe" open>
				<summary class="abe-groupe-titre">Charter Search</summary>

				<div class="abe-champs-groupe">
					<div class="abe-champ">
						<label for="abc-destination-select">Destination</label>
						<select id="abc-destination-select" class="ab-input">
							<option value="">Any</option>
							<?php foreach ( $destinations as $ville ) : ?>
								<option value="<?php echo esc_attr( $ville ); ?>"><?php echo esc_html( $ville ); ?></option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="abe-champ">
						<label for="abc-season-select">Season</label>
						<select id="abc-season-select" class="ab-input">
							<option value="">All seasons</option>
							<?php foreach ( $saisons as $valeur => $libelle ) : ?>
								<option value="<?php echo esc_attr( $valeur ); ?>"><?php echo esc_html( $libelle ); ?></option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="abe-champ">
						<label for="abc-guests">Guests</label>
						<input type="number" id="abc-guests" class="ab-input" min="1" max="100" step="1" placeholder="Number of guests">
					</div>

					<div class="abe-champ">
						<label for="abc-duration-select">Duration</label>
						<select id="abc-duration-select" class="ab-input">
							<option value="">All durations</option>
							<?php foreach ( $durees as $valeur => $libelle ) : ?>
								<option value="<?php echo esc_attr( $valeur ); ?>"><?php echo esc_html( $libelle ); ?></option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="abe-champ">
						<label>Price</label>
						<div class="abe-champ-plage">
							<input type="number" id="abc-price-min" class="ab-input" placeholder="Min" min="0">
							<input type="number" id="abc-price-max" class="ab-input" placeholder="Max" min="0">
						</div>
					</div>
				</div>
			</details>
		</aside>

		</div>

		<div class="abe-results-section">
			<div class="abe-results-header-row">
				<div id="abc-filtres-actifs" class="abe-filtres-actifs" hidden>
					<div class="abe-filtres-actifs-header">
						<span class="abe-filtres-actifs-titre">Active filters</span>
						<button id="abc-reset-filter" class="ab-reset-btn abe-erase-btn" type="button">Erase filters</button>
					</div>
					<div id="abc-pills" class="abe-pills"></div>
				</div>

				<div class="abe-results-summary-col">
					<div id="ab-message" class="ab-message" hidden></div>
				</div>
			</div>

			<div id="ab-results-grid" class="ab-results-grid"></div>
			<div id="ab-pagination" class="ab-pagination" hidden></div>
		</div>

	</div>
	<?php
	return ob_get_clean();
} );
