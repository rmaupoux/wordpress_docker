<?php
/**
 * Shortcode [annuaire_recherche] - Recherche de contacts maritimes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_shortcode( 'annuaire_recherche', function () {
	ob_start();
	?>
	<div class="am-recherche">

		<div class="am-search-section">
			<h2 class="am-search-title">Find the contact that's right for you!</h2>

			<div class="am-search-inputs">

				<!-- Recherche par nom / prénom -->
				<div class="am-bloc am-input-wrapper">
					<input
						type="search"
						id="am-recherche-input"
						placeholder="Search for a contact by first or last name…"
						autocomplete="off"
						class="am-input"
					/>
					<svg class="am-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>

				<!-- Filtre par pays -->
				<div class="am-bloc">
					<button type="button" id="am-pays-bouton" class="am-filtre-bouton ab-select-trigger" aria-haspopup="listbox" aria-expanded="false">
						Filter by country…
					</button>
					<ul id="am-pays-liste" class="am-overlay" role="listbox" hidden></ul>
				</div>

				<!-- Filtre par type de contact -->
				<div class="am-bloc">
					<button type="button" id="am-type-bouton" class="am-filtre-bouton ab-select-trigger" aria-haspopup="listbox" aria-expanded="false">
						Filter by contact type…
					</button>
					<ul id="am-type-liste" class="am-overlay" role="listbox" hidden></ul>
				</div>

			</div>
		</div>

		<!-- Zone de résultats commune, sous les trois colonnes -->
		<div class="am-resultats-zone">
			<p id="am-message" hidden></p>
			<ul id="am-resultats" hidden></ul>
		</div>

	</div>
	<?php
	return ob_get_clean();
} );
