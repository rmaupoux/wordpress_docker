/**
 * Filtre unifié de bateaux [annuaire_bateaux_filtres_equipements] : model/type/
 * pays/longueur/année/prix + champs "Plus de champs"/"Engine" (texte, plages
 * numériques) + groupes d'équipements (checkboxes) — tous cumulés en ET,
 * résultats instantanés (voir includes/endpoints/bateaux.php :: ab_filtrer_bateaux).
 *
 * Les URLs REST sont fournies par wp_localize_script() via AnnuaireUnifieeEquipementsVars
 * (voir includes/class-plugin.php). Le prix est saisi/affiché dans la devise
 * courante de js/currency.js (window.AbCurrency), converti en EUR avant l'appel REST.
 */
(function () {
	var root = document.getElementById('abe-root');
	if (!root) {
		return;
	}

	var endpointFiltrer     = AnnuaireUnifieeEquipementsVars.filtrer;
	var endpointTypes       = AnnuaireUnifieeEquipementsVars.types;
	var endpointPays        = AnnuaireUnifieeEquipementsVars.pays;
	var endpointValeursChamp = AnnuaireUnifieeEquipementsVars.valeursChamp;

	var checkboxes     = document.querySelectorAll('.abe-filtre-checkbox');
	var champsTexte     = document.querySelectorAll('.abe-champ-texte');
	var champsNumeriques = document.querySelectorAll('.abe-champ-numerique');

	var resultsGrid         = document.getElementById('ab-results-grid');
	var message              = document.getElementById('ab-message');
	var paginationContainer  = document.getElementById('ab-pagination');
	var resetBtn             = document.getElementById('abe-reset-filter');
	var pillsContainer       = document.getElementById('abe-pills');

	var modelInput   = document.getElementById('abe-model');
	var typeSelect   = document.getElementById('abe-type-select');
	var paysSelect   = document.getElementById('abe-pays-select');
	var lengthMin    = document.getElementById('abe-length-min');
	var lengthMax    = document.getElementById('abe-length-max');
	var yearMin      = document.getElementById('abe-year-min');
	var yearMax      = document.getElementById('abe-year-max');
	var priceMin     = document.getElementById('abe-price-min');
	var priceMax     = document.getElementById('abe-price-max');

	/* ===== Collecte des filtres ===== */

	function equipementsCoches() {
		return Array.prototype.filter.call(checkboxes, function (cb) {
			return cb.checked;
		}).map(function (cb) {
			return cb.value;
		});
	}

	function paramsChampsTexte() {
		var params = {};
		champsTexte.forEach(function (input) {
			var valeur = input.value.trim();
			if (valeur) {
				params[input.dataset.champSlug] = valeur;
			}
		});
		return params;
	}

	function paramsChampsNumeriques() {
		var plages = {};
		champsNumeriques.forEach(function (input) {
			var valeur = input.value.trim();
			if (!valeur) {
				return;
			}
			var slug = input.dataset.champSlug;
			plages[slug] = plages[slug] || {};
			plages[slug][input.dataset.borne] = valeur;
		});
		return plages;
	}

	function ajouterParam(url, cle, valeur) {
		return url + '&' + cle + '=' + encodeURIComponent(valeur);
	}

	function construireUrl(page) {
		var url = endpointFiltrer + '?page=' + (page || 1);

		equipementsCoches().forEach(function (slug) {
			url += '&equipements[]=' + encodeURIComponent(slug);
		});

		var texte = paramsChampsTexte();
		Object.keys(texte).forEach(function (slug) {
			url = ajouterParam(url, 'champs_texte[' + slug + ']', texte[slug]);
		});

		var numeriques = paramsChampsNumeriques();
		Object.keys(numeriques).forEach(function (slug) {
			var plage = numeriques[slug];
			if (plage.min) url = ajouterParam(url, 'champs_numeriques[' + slug + '][min]', plage.min);
			if (plage.max) url = ajouterParam(url, 'champs_numeriques[' + slug + '][max]', plage.max);
		});

		if (modelInput.value.trim()) url = ajouterParam(url, 'model', modelInput.value.trim());
		if (typeSelect.value) url = ajouterParam(url, 'type', typeSelect.value);
		if (paysSelect.value) url = ajouterParam(url, 'pays', paysSelect.value);
		if (lengthMin.value) url = ajouterParam(url, 'length_min', lengthMin.value);
		if (lengthMax.value) url = ajouterParam(url, 'length_max', lengthMax.value);
		if (yearMin.value) url = ajouterParam(url, 'year_min', yearMin.value);
		if (yearMax.value) url = ajouterParam(url, 'year_max', yearMax.value);

		// asking_price est stocké en EUR côté serveur (voir includes/endpoints/bateaux.php) :
		// les prix sont saisis dans la devise courante (js/currency.js), reconvertis en EUR ici.
		var versEUR = (window.AbCurrency && window.AbCurrency.toEuros) || function (v) { return v; };
		if (priceMin.value) url = ajouterParam(url, 'price_min', Math.round(versEUR(parseFloat(priceMin.value))));
		if (priceMax.value) url = ajouterParam(url, 'price_max', Math.round(versEUR(parseFloat(priceMax.value))));

		return url;
	}

	/* ===== Pastilles de filtres actifs ===== */

	// Libellé d'une plage min/max : cherche le <label> le plus proche dans le
	// conteneur .abe-champ commun aux deux inputs (pas de <label for=""> unique
	// possible ici, contrairement aux champs texte/model/type/pays).
	function libelleDepuisChamp(el) {
		var champ = el.closest('.abe-champ');
		var label = champ ? champ.querySelector('label') : null;
		return label ? label.textContent.trim() : '';
	}

	function ajouterPillPlage(pills, minEl, maxEl, libelle) {
		if (!minEl.value && !maxEl.value) {
			return;
		}
		pills.push({
			texte: libelle + ': ' + (minEl.value || '…') + ' – ' + (maxEl.value || '…'),
			retirer: function () { minEl.value = ''; maxEl.value = ''; }
		});
	}

	function collecterPills() {
		var pills = [];

		Array.prototype.forEach.call(checkboxes, function (cb) {
			if (!cb.checked) {
				return;
			}
			var label = cb.closest('label');
			var texte = label ? label.textContent.replace(/\s+/g, ' ').trim() : cb.value;
			pills.push({ texte: texte, retirer: function () { cb.checked = false; } });
		});

		if (modelInput.value.trim()) {
			var valeurModel = modelInput.value.trim();
			pills.push({ texte: 'Model: ' + valeurModel, retirer: function () { modelInput.value = ''; } });
		}

		if (typeSelect.value) {
			pills.push({
				texte: typeSelect.options[typeSelect.selectedIndex].textContent,
				retirer: function () { typeSelect.value = ''; }
			});
		}

		if (paysSelect.value) {
			pills.push({
				texte: paysSelect.options[paysSelect.selectedIndex].textContent,
				retirer: function () { paysSelect.value = ''; }
			});
		}

		ajouterPillPlage(pills, lengthMin, lengthMax, 'Length');
		ajouterPillPlage(pills, yearMin, yearMax, 'Year');
		ajouterPillPlage(pills, priceMin, priceMax, 'Price');

		champsTexte.forEach(function (input) {
			var valeur = input.value.trim();
			if (!valeur) {
				return;
			}
			var libelle = libelleDepuisChamp(input);
			pills.push({ texte: libelle + ': ' + valeur, retirer: function () { input.value = ''; } });
		});

		// Les plages numériques génériques partagent un même data-champ-slug entre
		// leurs deux inputs (min/max) : on ne les traite qu'une fois chacune.
		var slugsTraites = {};
		champsNumeriques.forEach(function (input) {
			var slug = input.dataset.champSlug;
			if (slugsTraites[slug]) {
				return;
			}
			slugsTraites[slug] = true;

			var minEl = document.querySelector('.abe-champ-numerique[data-champ-slug="' + slug + '"][data-borne="min"]');
			var maxEl = document.querySelector('.abe-champ-numerique[data-champ-slug="' + slug + '"][data-borne="max"]');
			ajouterPillPlage(pills, minEl, maxEl, libelleDepuisChamp(minEl));
		});

		return pills;
	}

	function afficherPills() {
		var pills = collecterPills();
		pillsContainer.innerHTML = '';
		pillsContainer.hidden = pills.length === 0;

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
		var prix = bateau.prix_euros ? bateau.prix_euros.toLocaleString('en-US') : 'N/A';
		var localisation = bateau.localisation || 'Location';
		var imageUrl = bateau.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3C/svg%3E";

		card.innerHTML =
			'<div class="ab-yacht-image"><img src="' + imageUrl + '" alt="' + titre + '"></div>' +
			'<div class="ab-yacht-body">' +
				'<h3 class="ab-yacht-title">' + titre + '</h3>' +
				'<p class="ab-yacht-price" data-price-euros="' + (bateau.prix_euros || 0) + '">' + prix + '&nbsp;€</p>' +
				'<div class="ab-yacht-location">' +
					'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
						'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>' +
					'</svg>' +
					'<span>' + localisation + '</span>' +
				'</div>' +
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

	/* ===== Autocomplétion des champs texte (3+ caractères, valeurs déjà en base) =====
	   Whitelist AB_CHAMPS_AUTOCOMPLETE côté serveur (voir includes/helpers.php et
	   /annuaire-bateau/v1/valeurs-champ) : model + tous les .abe-champ-texte. */
	var autocompleteInstances = [];

	function afficherSuggestions(dropdown, input, valeurs) {
		dropdown.innerHTML = '';

		if (!valeurs.length) {
			dropdown.hidden = true;
			return;
		}

		var retirer = document.createElement('li');
		retirer.className = 'abe-autocomplete-option abe-autocomplete-reset';
		retirer.innerHTML = '<span>Remove filter</span><span class="abe-autocomplete-reset-croix">✕</span>';
		retirer.addEventListener('click', function () {
			input.value = '';
			dropdown.hidden = true;
			afficherPills();
			charger(1, true);
		});
		dropdown.appendChild(retirer);

		valeurs.forEach(function (valeur) {
			var li = document.createElement('li');
			li.className = 'abe-autocomplete-option';
			li.textContent = valeur;
			li.addEventListener('click', function () {
				input.value = valeur;
				dropdown.hidden = true;
				afficherPills();
				charger(1, true);
			});
			dropdown.appendChild(li);
		});

		dropdown.hidden = false;
	}

	function initAutocomplete(input, champSlug) {
		var dropdown = document.createElement('ul');
		dropdown.className = 'abe-autocomplete';
		dropdown.hidden = true;
		input.insertAdjacentElement('afterend', dropdown);
		autocompleteInstances.push({ input: input, dropdown: dropdown });

		var timer = null;
		var controller = null;

		input.addEventListener('input', function () {
			var terme = input.value.trim();
			clearTimeout(timer);

			if (terme.length < 3) {
				dropdown.hidden = true;
				return;
			}

			timer = setTimeout(function () {
				if (controller) controller.abort();
				controller = new AbortController();

				var url = endpointValeursChamp + '?champ=' + encodeURIComponent(champSlug) + '&terme=' + encodeURIComponent(terme);
				fetch(url, { signal: controller.signal })
					.then(function (r) { return r.json(); })
					.then(function (valeurs) { afficherSuggestions(dropdown, input, valeurs); })
					.catch(function (err) {
						if (err.name !== 'AbortError') {
							dropdown.hidden = true;
						}
					});
			}, 250);
		});
	}

	document.addEventListener('click', function (e) {
		autocompleteInstances.forEach(function (inst) {
			if (e.target !== inst.input && !inst.dropdown.contains(e.target)) {
				inst.dropdown.hidden = true;
			}
		});
	});

	initAutocomplete(modelInput, 'model');
	champsTexte.forEach(function (input) {
		initAutocomplete(input, input.dataset.champSlug);
	});

	/* ===== Écouteurs ===== */

	function onChangementImmediat() {
		afficherPills();
		charger(1, true);
	}

	checkboxes.forEach(function (cb) {
		cb.addEventListener('change', onChangementImmediat);
	});

	typeSelect.addEventListener('change', onChangementImmediat);
	paysSelect.addEventListener('change', onChangementImmediat);

	var debounceTimer = null;
	function onChangementDebounce() {
		afficherPills();
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(function () { charger(1, true); }, 400);
	}

	[modelInput, lengthMin, lengthMax, yearMin, yearMax, priceMin, priceMax]
		.forEach(function (input) { input.addEventListener('input', onChangementDebounce); });
	champsTexte.forEach(function (input) { input.addEventListener('input', onChangementDebounce); });
	champsNumeriques.forEach(function (input) { input.addEventListener('input', onChangementDebounce); });

	resetBtn.addEventListener('click', function () {
		checkboxes.forEach(function (cb) { cb.checked = false; });
		champsTexte.forEach(function (input) { input.value = ''; });
		champsNumeriques.forEach(function (input) { input.value = ''; });
		[modelInput, lengthMin, lengthMax, yearMin, yearMax, priceMin, priceMax]
			.forEach(function (input) { input.value = ''; });
		typeSelect.value = '';
		paysSelect.value = '';
		afficherPills();
		charger(1, true);
	});

	/* ===== Pré-remplissage depuis l'URL =====
	   Redirection possible depuis [annuaire_bateaux_recherche] (bouton SEARCH
	   YACHT, voir js/script.js) dès que Length/Year/Price y sont renseignés :
	   ces filtres ne s'appliquent plus sur la page d'accueil, ils sont transmis
	   ici en GET pour s'afficher en pastilles et être appliqués dès le
	   chargement de cette page. */
	var paramsURL = new URLSearchParams(window.location.search);

	function prefillDepuisURL() {
		if (paramsURL.has('model')) modelInput.value = paramsURL.get('model');
		if (paramsURL.has('length_min')) lengthMin.value = paramsURL.get('length_min');
		if (paramsURL.has('length_max')) lengthMax.value = paramsURL.get('length_max');
		if (paramsURL.has('year_min')) yearMin.value = paramsURL.get('year_min');
		if (paramsURL.has('year_max')) yearMax.value = paramsURL.get('year_max');

		// price_min/price_max sont transmis en EUR (voir js/script.js) : reconvertis
		// ici dans la devise courante de cette page (js/currency.js) pour l'édition.
		var versDevise = (window.AbCurrency && window.AbCurrency.fromEUR) || function (v) { return v; };
		if (paramsURL.has('price_min')) priceMin.value = Math.round(versDevise(parseFloat(paramsURL.get('price_min'))));
		if (paramsURL.has('price_max')) priceMax.value = Math.round(versDevise(parseFloat(paramsURL.get('price_max'))));
	}

	/* ===== Peuplement des selects dynamiques =====
	   Attend que types/pays soient chargés avant d'appliquer un éventuel
	   paramsURL.type / paramsURL.pays (les <option> doivent exister pour que
	   l'affectation de .value fonctionne) puis de lancer le chargement initial. */
	Promise.all([
		fetch(endpointTypes).then(function (r) { return r.json(); }).catch(function () { return []; }),
		fetch(endpointPays).then(function (r) { return r.json(); }).catch(function () { return []; })
	]).then(function (resultats) {
		(resultats[0] || []).forEach(function (type) {
			var opt = document.createElement('option');
			opt.value = type.slug;
			opt.textContent = type.label;
			typeSelect.appendChild(opt);
		});

		(resultats[1] || []).forEach(function (p) {
			var opt = document.createElement('option');
			opt.value = p.code;
			opt.textContent = p.label;
			paysSelect.appendChild(opt);
		});

		if (paramsURL.has('type')) typeSelect.value = paramsURL.get('type');
		if (paramsURL.has('pays')) paysSelect.value = paramsURL.get('pays');

		// Chargement initial : reflète les filtres restaurés depuis l'URL, ou par
		// le navigateur (retour arrière, autofill) sur les champs de la sidebar.
		prefillDepuisURL();
		afficherPills();
		charger(1, false);
	});
})();
