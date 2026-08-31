<?php
/**
 * Shortcode [annuaire_bateaux_filtres_equipements] : filtre unifié de bateaux
 * (caractéristiques générales "Plus de champs", groupes d'équipements en
 * checkboxes, champs moteur) — colonne de filtres à gauche, résultats
 * instantanés sous forme de cartes à droite. Vocation à terme : remplacer le
 * formulaire de recherche de [annuaire_bateaux_recherche] (voir bateaux.php).
 *
 * Réutilise les IDs ab-message / ab-results-grid / ab-pagination et la classe
 * .ab-results-grid déjà gérés par js/currency.js (switcher de devise
 * auto-injecté + reformatage des prix sur mutation de #ab-results-grid).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Rend une liste de checkboxes .abe-filtre-checkbox (collectées telles quelles
 * par js/equipements.js, quel que soit le groupe qui les a rendues).
 */
function ab_render_checkboxes_equipements( array $champs ) {
	?>
	<ul class="abe-checkbox-list">
		<?php foreach ( $champs as $slug => $label ) : ?>
			<li class="abe-checkbox-item">
				<label>
					<input type="checkbox" class="abe-filtre-checkbox" value="<?php echo esc_attr( $slug ); ?>">
					<?php echo esc_html( $label ); ?>
				</label>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
}

/**
 * Rend une liste de champs texte .abe-champ-texte (LIKE), lus par
 * js/equipements.js via l'attribut data-champ-slug.
 */
function ab_render_champs_texte( array $champs ) {
	?>
	<div class="abe-champs-groupe">
		<?php foreach ( $champs as $slug => $label ) : ?>
			<div class="abe-champ">
				<label for="abe-champ-<?php echo esc_attr( $slug ); ?>"><?php echo esc_html( $label ); ?></label>
				<input type="text" id="abe-champ-<?php echo esc_attr( $slug ); ?>" class="ab-input abe-champ-texte" data-champ-slug="<?php echo esc_attr( $slug ); ?>" autocomplete="off">
			</div>
		<?php endforeach; ?>
	</div>
	<?php
}

/**
 * Rend une liste de plages numériques min/max .abe-champ-numerique, lues par
 * js/equipements.js via l'attribut data-champ-slug (partagé par les deux inputs
 * min/max d'une même plage, distingués par data-borne="min|max").
 */
function ab_render_champs_numeriques( array $champs ) {
	?>
	<div class="abe-champs-groupe">
		<?php foreach ( $champs as $slug => $label ) : ?>
			<div class="abe-champ">
				<label><?php echo esc_html( $label ); ?></label>
				<div class="abe-champ-plage">
					<input type="number" class="ab-input abe-champ-numerique" data-champ-slug="<?php echo esc_attr( $slug ); ?>" data-borne="min" placeholder="Min" min="0">
					<input type="number" class="ab-input abe-champ-numerique" data-champ-slug="<?php echo esc_attr( $slug ); ?>" data-borne="max" placeholder="Max" min="0">
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
}

add_shortcode( 'annuaire_bateaux_filtres_equipements', function () {
	ob_start();
	?>
	<div class="abe-filtres" id="abe-root">

		<aside class="abe-sidebar">
			<div class="abe-sidebar-header">
				<h2 class="abe-sidebar-title">Filters</h2>
				<button id="abe-reset-filter" class="ab-reset-btn" type="button" title="Réinitialiser les filtres">✕</button>
			</div>

			<div id="abe-pills" class="abe-pills" hidden></div>

			<details class="abe-groupe" open>
				<summary class="abe-groupe-titre">Plus de champs</summary>

				<div class="abe-champs-groupe">
					<div class="abe-champ">
						<label for="abe-model">Model</label>
						<input type="text" id="abe-model" class="ab-input" autocomplete="off">
					</div>

					<div class="abe-champ">
						<label for="abe-type-select">Type</label>
						<select id="abe-type-select" class="ab-input">
							<option value="">All types</option>
						</select>
					</div>

					<div class="abe-champ">
						<label for="abe-pays-select">Country</label>
						<select id="abe-pays-select" class="ab-input">
							<option value="">All countries</option>
						</select>
					</div>

					<div class="abe-champ">
						<label>Length (ft)</label>
						<div class="abe-champ-plage">
							<input type="number" id="abe-length-min" class="ab-input" placeholder="Min" min="0">
							<input type="number" id="abe-length-max" class="ab-input" placeholder="Max" min="0">
						</div>
					</div>

					<div class="abe-champ">
						<label>Year</label>
						<div class="abe-champ-plage">
							<input type="number" id="abe-year-min" class="ab-input" placeholder="Min" min="1970" max="2100">
							<input type="number" id="abe-year-max" class="ab-input" placeholder="Max" min="1970" max="2100">
						</div>
					</div>

					<div class="abe-champ">
						<label>Price</label>
						<div class="abe-champ-plage">
							<input type="number" id="abe-price-min" class="ab-input" placeholder="Min" min="0">
							<input type="number" id="abe-price-max" class="ab-input" placeholder="Max" min="0">
						</div>
					</div>
				</div>

				<?php ab_render_champs_texte( AB_GROUPES_CHAMPS_TEXTE['Plus de champs'] ); ?>
				<?php ab_render_champs_numeriques( AB_GROUPES_CHAMPS_NUMERIQUES['Plus de champs'] ); ?>

				<ul class="abe-checkbox-list">
					<li class="abe-checkbox-item">
						<label>
							<input type="checkbox" class="abe-filtre-checkbox" value="a_la_une">
							Featured (à la une)
						</label>
					</li>
					<li class="abe-checkbox-item">
						<label>
							<input type="checkbox" class="abe-filtre-checkbox" value="vat">
							VAT Paid
						</label>
					</li>
				</ul>
			</details>

			<?php foreach ( AB_GROUPES_EQUIPEMENTS as $groupe => $champs ) : ?>
				<details class="abe-groupe">
					<summary class="abe-groupe-titre"><?php echo esc_html( $groupe ); ?></summary>
					<?php ab_render_checkboxes_equipements( $champs ); ?>
				</details>
			<?php endforeach; ?>

			<details class="abe-groupe">
				<summary class="abe-groupe-titre">Engine</summary>
				<?php ab_render_champs_texte( AB_GROUPES_CHAMPS_TEXTE['Engine'] ); ?>
				<?php ab_render_champs_numeriques( AB_GROUPES_CHAMPS_NUMERIQUES['Engine'] ); ?>
			</details>
		</aside>

		<div class="abe-results-section">
			<div id="ab-message" class="ab-message" hidden></div>
			<div id="ab-results-grid" class="ab-results-grid"></div>
			<div id="ab-pagination" class="ab-pagination" hidden></div>
		</div>

	</div>
	<?php
	return ob_get_clean();
} );
