/**
 * Filtre dédié aux bateaux en charter [annuaire_bateaux_filtres_charter] :
 * Destination/Season/Guests/Duration/Price, cumulés en ET côté REST (voir
 * includes/endpoints/charter.php :: ab_charter_filtrer_bateaux). Même logique
 * que js/equipements.js, réduite aux 6 filtres propres au charter.
 *
 * Les URLs REST sont fournies par wp_localize_script() via
 * AnnuaireUnifieeCharterVars (voir includes/class-plugin.php). Le prix est
 * saisi/affiché dans la devise courante de js/currency.js (window.AbCurrency),
 * converti en EUR avant l'appel REST.
 */
(function () {
	var root = document.getElementById('abc-root');
	if (!root) {
		return;
	}

	var endpointFiltrer     = AnnuaireUnifieeCharterVars.filtrer;
	var endpointDestinations = AnnuaireUnifieeCharterVars.destinations;
	var endpointSeasons      = AnnuaireUnifieeCharterVars.seasons;
	var endpointDurations    = AnnuaireUnifieeCharterVars.durations;

	var resultsGrid        = document.getElementById('ab-results-grid');
	var message             = document.getElementById('ab-message');
	var paginationContainer = document.getElementById('ab-pagination');
	var resetBtn            = document.getElementById('abc-reset-filter');
	var pillsContainer      = document.getElementById('abc-pills');
	var filtresActifsBox    = document.getElementById('abc-filtres-actifs');

	var destinationSelect = document.getElementById('abc-destination-select');
	var seasonSelect       = document.getElementById('abc-season-select');
	var guestsInput        = document.getElementById('abc-guests');
	var durationSelect     = document.getElementById('abc-duration-select');
	var priceMin            = document.getElementById('abc-price-min');
	var priceMax            = document.getElementById('abc-price-max');

	/* ===== Construction de l'URL de requête ===== */

	function ajouterParam(url, cle, valeur) {
		return url + '&' + cle + '=' + encodeURIComponent(valeur);
	}

	function construireUrl(page) {
		var url = endpointFiltrer + '?page=' + (page || 1);

		if (destinationSelect.value) url = ajouterParam(url, 'destination', destinationSelect.value);
		if (seasonSelect.value) url = ajouterParam(url, 'season', seasonSelect.value);
		if (guestsInput.value) url = ajouterParam(url, 'guests', guestsInput.value);
		if (durationSelect.value) url = ajouterParam(url, 'duration', durationSelect.value);

		// charter_price_min/max sont stockés en EUR côté serveur : les prix sont
		// saisis dans la devise courante (js/currency.js), reconvertis en EUR ici.
		var versEUR = (window.AbCurrency && window.AbCurrency.toEuros) || function (v) { return v; };
		if (priceMin.value) url = ajouterParam(url, 'price_min', Math.round(versEUR(parseFloat(priceMin.value))));
		if (priceMax.value) url = ajouterParam(url, 'price_max', Math.round(versEUR(parseFloat(priceMax.value))));

		return url;
	}

	/* ===== Pastilles de filtres actifs ===== */

	function collecterPills() {
		var pills = [];

		if (destinationSelect.value) {
			pills.push({
				texte: destinationSelect.options[destinationSelect.selectedIndex].textContent,
				retirer: function () { destinationSelect.value = ''; }
			});
		}

		if (seasonSelect.value) {
			pills.push({
				texte: seasonSelect.options[seasonSelect.selectedIndex].textContent,
				retirer: function () { seasonSelect.value = ''; }
			});
		}

		if (guestsInput.value) {
			pills.push({ texte: 'Guests: ' + guestsInput.value, retirer: function () { guestsInput.value = ''; } });
		}

		if (durationSelect.value) {
			pills.push({
				texte: durationSelect.options[durationSelect.selectedIndex].textContent,
				retirer: function () { durationSelect.value = ''; }
			});
		}

		if (priceMin.value || priceMax.value) {
			pills.push({
				texte: 'Price: ' + (priceMin.value || '…') + ' – ' + (priceMax.value || '…'),
				retirer: function () { priceMin.value = ''; priceMax.value = ''; }
			});
		}

		return pills;
	}

	function afficherPills() {
		var pills = collecterPills();
		pillsContainer.innerHTML = '';
		filtresActifsBox.hidden = pills.length === 0;

		pills.forEach(function (pill) {
			var el = document.createElement('span');
			el.className = 'abe-pill';

			var texte = document.createElement('span');
			texte.className = 'abe-pill-texte';
			texte.textContent = pill.texte;
			el.appendChild(texte);

			var bouton = document.createElement('button');
			bouton.type = 'button';
			bouton.className = 'abe-pill-remove';
			bouton.setAttribute('aria-label', 'Retirer ce filtre');
			bouton.textContent = '×';
			bouton.addEventListener('click', function () {
				pill.retirer();
				afficherPills();
				charger(1, true);
			});
			el.appendChild(bouton);

			pillsContainer.appendChild(el);
		});
	}

	/* ===== Rendu ===== */

	function afficherMessage(texte) {
		message.textContent = texte;
		message.hidden = false;
	}

	function creerCarteBateau(bateau) {
		var card = document.createElement('div');
		card.className = 'ab-yacht-card';
		var titre = bateau.model || bateau.titre;
		var prix = bateau.prix_min_euros ? bateau.prix_min_euros.toLocaleString('en-US') : 'N/A';
		var localisation = bateau.localisation || 'Location';
		var imageUrl = bateau.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3C/svg%3E";

		card.innerHTML =
			'<div class="ab-yacht-image"><img src="' + imageUrl + '" alt="' + titre + '"></div>' +
			'<div class="ab-yacht-body">' +
				'<h3 class="ab-yacht-title">' + titre + '</h3>' +
				'<p class="ab-yacht-price" data-price-euros="' + (bateau.prix_min_euros || 0) + '">From ' + prix + '&nbsp;€</p>' +
				'<div class="ab-yacht-location">' +
					'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
						'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>' +
					'</svg>' +
					'<span>' + localisation + '</span>' +
				'</div>' +
				(bateau.guests ? '<p class="ab-yacht-guests">' + bateau.guests + ' guests</p>' : '') +
				'<a href="' + bateau.lien + '" class="ab-yacht-btn">More Information</a>' +
			'</div>';

		return card;
	}

	function afficherPagination(pagination) {
		paginationContainer.innerHTML = '';

		if (pagination.total_pages <= 1) {
			paginationContainer.hidden = true;
			return;
		}
		paginationContainer.hidden = false;

		var prevBtn = document.createElement('button');
		prevBtn.textContent = '← Previous';
		prevBtn.disabled = pagination.page === 1;
		prevBtn.addEventListener('click', function () { charger(pagination.page - 1, true); });
		paginationContainer.appendChild(prevBtn);

		for (var i = 1; i <= pagination.total_pages; i++) {
			(function (page) {
				var pageBtn = document.createElement('button');
				pageBtn.textContent = page;
				if (page === pagination.page) {
					pageBtn.classList.add('active');
					pageBtn.disabled = true;
				}
				pageBtn.addEventListener('click', function () { charger(page, true); });
				paginationContainer.appendChild(pageBtn);
			})(i);
		}

		var nextBtn = document.createElement('button');
		nextBtn.textContent = 'Next →';
		nextBtn.disabled = pagination.page === pagination.total_pages;
		nextBtn.addEventListener('click', function () { charger(pagination.page + 1, true); });
		paginationContainer.appendChild(nextBtn);
	}

	function afficherResultats(data) {
		resultsGrid.innerHTML = '';
		var bateaux = data.bateaux || [];
		var pagination = data.pagination || { total: bateaux.length, total_pages: 1, page: 1 };

		if (bateaux.length === 0) {
			afficherMessage('No boat found.');
			paginationContainer.hidden = true;
			return;
		}

		afficherMessage(pagination.total + ' boat' + (pagination.total > 1 ? 's' : '') + ' found');
		bateaux.forEach(function (bateau) {
			resultsGrid.appendChild(creerCarteBateau(bateau));
		});

		afficherPagination(pagination);
	}

	function charger(page, scroller) {
		afficherMessage('Chargement...');
		fetch(construireUrl(page))
			.then(function (r) { return r.json(); })
			.then(afficherResultats)
			.catch(function () { afficherMessage('Erreur lors du chargement.'); });

		if (scroller) {
			root.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/* ===== Écouteurs ===== */

	function onChangementImmediat() {
		afficherPills();
		charger(1, true);
	}

	destinationSelect.addEventListener('change', onChangementImmediat);
	seasonSelect.addEventListener('change', onChangementImmediat);
	durationSelect.addEventListener('change', onChangementImmediat);

	var debounceTimer = null;
	function onChangementDebounce() {
		afficherPills();
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(function () { charger(1, true); }, 400);
	}

	[guestsInput, priceMin, priceMax].forEach(function (input) {
		input.addEventListener('input', onChangementDebounce);
	});

	resetBtn.addEventListener('click', function () {
		destinationSelect.value = '';
		seasonSelect.value = '';
		durationSelect.value = '';
		guestsInput.value = '';
		priceMin.value = '';
		priceMax.value = '';
		afficherPills();
		charger(1, true);
	});

	/* ===== Pré-remplissage depuis l'URL =====
	   Redirection possible depuis [annuaire_tabs] (bouton SEARCH CHARTER, voir
	   js/script.js) avec ces filtres en GET, pour s'afficher en pastilles et
	   être appliqués dès le chargement de cette page. */
	var paramsURL = new URLSearchParams(window.location.search);

	function prefillDepuisURL() {
		if (paramsURL.has('guests')) guestsInput.value = paramsURL.get('guests');

		// price_min/price_max sont transmis en EUR (voir js/script.js) : reconvertis
		// ici dans la devise courante de cette page (js/currency.js) pour l'édition.
		var versDevise = (window.AbCurrency && window.AbCurrency.fromEUR) || function (v) { return v; };
		if (paramsURL.has('price_min')) priceMin.value = Math.round(versDevise(parseFloat(paramsURL.get('price_min'))));
		if (paramsURL.has('price_max')) priceMax.value = Math.round(versDevise(parseFloat(paramsURL.get('price_max'))));
	}

	/* ===== Peuplement des selects dynamiques =====
	   Attend que destination/season/duration soient chargées avant d'appliquer
	   un éventuel paramsURL (les <option> doivent exister pour que l'affectation
	   de .value fonctionne) puis de lancer le chargement initial. */
	Promise.all([
		fetch(endpointDestinations).then(function (r) { return r.json(); }).catch(function () { return []; }),
		fetch(endpointSeasons).then(function (r) { return r.json(); }).catch(function () { return []; }),
		fetch(endpointDurations).then(function (r) { return r.json(); }).catch(function () { return []; })
	]).then(function (resultats) {
		(resultats[0] || []).forEach(function (option) {
			var opt = document.createElement('option');
			opt.value = option.value;
			opt.textContent = option.label;
			destinationSelect.appendChild(opt);
		});

		(resultats[1] || []).forEach(function (option) {
			var opt = document.createElement('option');
			opt.value = option.value;
			opt.textContent = option.label;
			seasonSelect.appendChild(opt);
		});

		(resultats[2] || []).forEach(function (option) {
			var opt = document.createElement('option');
			opt.value = option.value;
			opt.textContent = option.label;
			durationSelect.appendChild(opt);
		});

		if (paramsURL.has('destination')) destinationSelect.value = paramsURL.get('destination');
		if (paramsURL.has('season')) seasonSelect.value = paramsURL.get('season');
		if (paramsURL.has('duration')) durationSelect.value = paramsURL.get('duration');

		// Chargement initial : reflète les filtres restaurés depuis l'URL, ou par
		// le navigateur (retour arrière, autofill) sur les champs de la sidebar.
		prefillDepuisURL();
		afficherPills();
		charger(1, false);
	});
})();
