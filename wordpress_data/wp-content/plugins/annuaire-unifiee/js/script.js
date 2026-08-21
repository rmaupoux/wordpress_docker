/**
 * Annuaire Unifié - Scripts JS
 * Regroupe les scripts originaux de annuaire-bateaux-recherche (YACHT/tabs/NETWORK)
 * et annuaire-maritime-recherche (CHARTER)
 *
 * Les URLs REST sont fournies par wp_localize_script() via AnnuaireUnifieeVars
 */

// ===== Gestion des onglets =====
// Gestion des onglets
(function() {
	const tabBtns = document.querySelectorAll('.ab-tab-btn');
	const tabPanes = document.querySelectorAll('.ab-tab-pane');

	tabBtns.forEach(btn => {
		btn.addEventListener('click', function() {
			const tabName = this.getAttribute('data-tab');

			// Retirer la classe active de tous les boutons et panes
			tabBtns.forEach(b => b.classList.remove('ab-tab-active'));
			tabPanes.forEach(p => p.classList.remove('ab-tab-active'));

			// Ajouter la classe active au bouton et pane cliqués
			this.classList.add('ab-tab-active');
			document.getElementById('ab-tab-' + tabName).classList.add('ab-tab-active');
		});
	});
})();


// ===== YACHT: recherche et filtres bateaux =====
(function () {
	const endpointRechercheModeles = AnnuaireUnifieeVars.bateaux.rechercheModeles;
	const endpointTypes    = AnnuaireUnifieeVars.bateaux.types;
	const endpointFiltrer  = AnnuaireUnifieeVars.bateaux.filtrer;
	const endpointAlaUne   = AnnuaireUnifieeVars.bateaux.alaUne;

	/* ===== CUSTOM SELECT ===== */
	class CustomSelect {
		constructor(selectEl) {
			this.select = selectEl;
			this.wrapper = selectEl.closest('.ab-select-wrapper');
			this.trigger = this.wrapper.querySelector('.ab-select-trigger');
			this.options = this.wrapper.querySelector('.ab-select-options');
			this.init();
		}

		init() {
			this.updateOptions();
			this.trigger.addEventListener('click', () => this.toggleOpen());
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.ab-select-wrapper') || !e.target.closest(this.wrapper)) {
					this.close();
				}
			});
		}

		updateOptions() {
			this.options.innerHTML = '';
			this.select.querySelectorAll('option').forEach(opt => {
				if (opt.value) {
					const li = document.createElement('li');
					li.className = 'ab-select-option';
					li.textContent = opt.textContent;
					li.dataset.value = opt.value;
					li.addEventListener('click', () => this.selectOption(opt.value, opt.textContent));
					this.options.appendChild(li);
				}
			});
		}

		toggleOpen() {
			if (this.options.classList.contains('open')) {
				this.close();
			} else {
				this.open();
			}
		}

		open() {
			this.options.classList.add('open');
			this.trigger.classList.add('active');
		}

		close() {
			this.options.classList.remove('open');
			this.trigger.classList.remove('active');
		}

		selectOption(value, text) {
			this.select.value = value;
			this.trigger.textContent = text;
			this.options.querySelectorAll('.ab-select-option').forEach(opt => {
				opt.classList.toggle('selected', opt.dataset.value === value);
			});
			this.close();
			// Déclencher l'événement change pour notifier les listeners
			this.select.dispatchEvent(new Event('change', { bubbles: true }));
		}
	}

	// Initialiser les selects - stockez les instances pour pouvoir les réutiliser
	const customSelects = {};
	document.querySelectorAll('.ab-select-native').forEach(sel => {
		const instance = new CustomSelect(sel);
		customSelects[sel.id] = instance;
	});

	/* ===== SEARCH FUNCTIONALITY ===== */
	const searchInput = document.getElementById('ab-search-input');
	const typeSelect = document.getElementById('ab-type-select');
	const searchBtn = document.getElementById('ab-search-btn');
	const message = document.getElementById('ab-message');
	const resultsGrid = document.getElementById('ab-results-grid');
	const paginationContainer = document.getElementById('ab-pagination');
	const resultsSection = document.getElementById('ab-results-section');

	let searchTimer = null;
	let controller = null;
	let currentPage = 1;
	let currentFilters = {};
	let rechercheLancee = false;

	function lancerRecherche(filters, page = 1) {
		rechercheLancee = true;
		resultsSection.hidden = false;
		chargerAvecFiltres(filters, page);
	}

	// Créer un wrapper pour afficher les suggestions de modèles
	const modelesDropdown = document.createElement('div');
	modelesDropdown.id = 'ab-modeles-dropdown';
	modelesDropdown.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d5db; border-top: none; border-radius: 0 0 0.375rem 0.375rem; max-height: 200px; overflow-y: auto; z-index: 10; display: none; list-style: none; margin: 0; padding: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);';
	searchInput.parentElement.style.position = 'relative';
	searchInput.parentElement.appendChild(modelesDropdown);

	// Recherche instantanée de bateaux par modèle (3+ caractères, 10 résultats max)
	searchInput.addEventListener('input', function () {
		const terme = this.value.trim();
		modelesDropdown.innerHTML = '';

		clearTimeout(searchTimer);

		if (terme.length < 3) {
			modelesDropdown.style.display = 'none';
			currentFilters.model = '';
			if (rechercheLancee) {
				chargerAvecFiltres(currentFilters, 1);
			}
			return;
		}

		searchTimer = setTimeout(() => {
			if (controller) controller.abort();
			controller = new AbortController();

			fetch(endpointRechercheModeles + '?terme=' + encodeURIComponent(terme), { signal: controller.signal })
				.then(r => r.json())
				.then(bateaux => afficherModelesDropdown(bateaux))
				.catch(err => {
					if (err.name !== 'AbortError') {
						afficherMessage('Erreur lors de la recherche.');
					}
				});
		}, 250);
	});

	function afficherModelesDropdown(bateaux) {
		modelesDropdown.innerHTML = '';

		if (!Array.isArray(bateaux) || bateaux.length === 0) {
			// Afficher le message "pas de résultat trouvé" dans la dropdown
			const li = document.createElement('li');
			li.style.cssText = 'padding: 0.5rem; cursor: default; font-size: 0.875rem; color: #999; text-align: center;';
			li.textContent = 'Pas de résultat trouvé';
			modelesDropdown.appendChild(li);
			modelesDropdown.style.display = 'block';
			return;
		}

		bateaux.forEach(bateau => {
			const li = document.createElement('li');
			li.style.cssText = 'padding: 0.5rem; cursor: pointer; font-size: 0.875rem; border-bottom: 1px solid #eee;';
			li.textContent = bateau.model;
			li.addEventListener('click', () => {
				modelesDropdown.style.display = 'none';
				window.location.href = bateau.url;
			});
			li.addEventListener('mouseover', () => {
				li.style.background = '#f3f4f6';
			});
			li.addEventListener('mouseout', () => {
				li.style.background = 'transparent';
			});
			modelesDropdown.appendChild(li);
		});

		modelesDropdown.style.display = 'block';
	}

	// Fermer la dropdown en cliquant ailleurs
	document.addEventListener('click', (e) => {
		if (!e.target.closest('#ab-search-input') && !e.target.closest('#ab-modeles-dropdown')) {
			modelesDropdown.style.display = 'none';
		}
	});

	function chargerAvecFiltres(filters = {}, page = 1) {
		currentFilters = filters;
		currentPage = page;

		let url = endpointFiltrer + '?page=' + page;
		if (filters.model) url += '&model=' + encodeURIComponent(filters.model);
		if (filters.type) url += '&type=' + encodeURIComponent(filters.type);
		if (filters.length_min) url += '&length_min=' + filters.length_min;
		if (filters.length_max) url += '&length_max=' + filters.length_max;
		if (filters.year_min) url += '&year_min=' + filters.year_min;
		if (filters.year_max) url += '&year_max=' + filters.year_max;
		if (filters.price_min) url += '&price_min=' + filters.price_min;
		if (filters.price_max) url += '&price_max=' + filters.price_max;

		afficherMessage('Chargement...');
		fetch(url)
			.then(r => r.json())
			.then(data => afficherBateaux(data))
			.catch(() => afficherMessage('Erreur lors du chargement.'));
	}

	// Bouton reset filter
	document.getElementById('ab-reset-filter').addEventListener('click', function() {
		// Réinitialiser tous les filtres
		searchInput.value = '';
		typeSelect.value = '';
		document.getElementById('ab-length-min-select').value = '';
		document.getElementById('ab-length-max-select').value = '';
		document.getElementById('ab-year-min').value = '';
		document.getElementById('ab-year-max').value = '';
		document.getElementById('ab-price-min').value = '';
		document.getElementById('ab-price-max').value = '';

		currentFilters = {};
		modelesDropdown.style.display = 'none';
		featuredSection.hidden = false;

		// Réinitialiser les triggers des custom selects
		if (customSelects['ab-type-select']) {
			customSelects['ab-type-select'].selectOption('', 'Select type');
		}

		// Revenir à l'état initial : masquer les résultats tant qu'aucune recherche n'est lancée
		rechercheLancee = false;
		resultsSection.hidden = true;
		resultsGrid.innerHTML = '';
		paginationContainer.hidden = true;
	});

	// Charger les types au chargement
	fetch(endpointTypes)
		.then(r => r.json())
		.then(types => {
			const typeSelect = document.getElementById('ab-type-select');

			// Ajouter les types (les options vides existantes sont déjà là)
			types.forEach(type => {
				const opt = document.createElement('option');
				opt.value = type.slug;
				opt.textContent = type.label;
				typeSelect.appendChild(opt);
			});

			// Mettre à jour les options du CustomSelect
			if (customSelects['ab-type-select']) {
				customSelects['ab-type-select'].updateOptions();
			}

			// Événement pour filtrer instantanément quand on change le type
			typeSelect.addEventListener('change', function() {
				featuredSection.hidden = true;
				const selectedType = this.value;
				if (!selectedType) {
					// "Tous les types" sélectionné
					currentFilters.type = '';
					lancerRecherche({}, 1);
				} else {
					currentFilters.type = selectedType;
					lancerRecherche(currentFilters, 1);
				}
			});
		});

	// Recherche au clic sur Search Yacht
	searchBtn.addEventListener('click', function () {
		featuredSection.hidden = true;

		// asking_price est stocké en EUR côté serveur (voir includes/endpoints/bateaux.php) :
		// les champs prix sont saisis dans la devise sélectionnée (js/currency.js),
		// donc on les reconvertit en EUR avant l'appel REST.
		const prixMin = parseFloat(document.getElementById('ab-price-min').value) || 0;
		const prixMax = parseFloat(document.getElementById('ab-price-max').value) || 0;
		const versEUR = (window.AbCurrency && window.AbCurrency.toEuros) || (v => v);

		const filters = {
			model:      searchInput.value.trim() || '',
			type:       typeSelect.value || '',
			length_min: parseFloat(document.getElementById('ab-length-min-select').value) || 0,
			length_max: parseFloat(document.getElementById('ab-length-max-select').value) || 0,
			year_min:   parseInt(document.getElementById('ab-year-min').value) || 0,
			year_max:   parseInt(document.getElementById('ab-year-max').value) || 0,
			price_min:  prixMin ? Math.round(versEUR(prixMin)) : 0,
			price_max:  prixMax ? Math.round(versEUR(prixMax)) : 0,
		};

		lancerRecherche(filters, 1);
	});

	function afficherBateaux(data) {
		resultsGrid.innerHTML = '';
		modelesDropdown.style.display = 'none';

		// Gérer la nouvelle structure avec pagination
		let bateaux = data;
		let pagination = null;

		if (data.bateaux) {
			bateaux = data.bateaux;
			pagination = data.pagination;
			currentPage = pagination.page;
			currentFilters = data.filters || {};
		}

		if (!Array.isArray(bateaux) || bateaux.length === 0) {
			afficherMessage('No boat found.');
			paginationContainer.hidden = true;
			return;
		}

		afficherMessage((pagination ? pagination.total : bateaux.length) + ' boat' + ((pagination ? pagination.total : bateaux.length) > 1 ? 's' : '') + ' found');

		bateaux.forEach(bateau => {
			resultsGrid.appendChild(creerCarteBateau(bateau, !!bateau.a_la_une));
		});

		// Afficher la pagination
		if (pagination) {
			afficherPagination(pagination);
		} else {
			paginationContainer.hidden = true;
		}
	}

	function afficherPagination(pagination) {
		paginationContainer.innerHTML = '';

		if (pagination.total_pages <= 1) {
			paginationContainer.hidden = true;
			return;
		}

		paginationContainer.hidden = false;

		// Bouton Précédent
		const prevBtn = document.createElement('button');
		prevBtn.textContent = '← Previous';
		prevBtn.disabled = pagination.page === 1;
		prevBtn.addEventListener('click', () => chargerPage(pagination.page - 1));
		paginationContainer.appendChild(prevBtn);

		// Numéros de page
		for (let i = 1; i <= pagination.total_pages; i++) {
			const pageBtn = document.createElement('button');
			pageBtn.textContent = i;
			if (i === pagination.page) {
				pageBtn.classList.add('active');
				pageBtn.disabled = true;
			}
			pageBtn.addEventListener('click', () => chargerPage(i));
			paginationContainer.appendChild(pageBtn);
		}

		// Bouton Suivant
		const nextBtn = document.createElement('button');
		nextBtn.textContent = 'Next →';
		nextBtn.disabled = pagination.page === pagination.total_pages;
		nextBtn.addEventListener('click', () => chargerPage(pagination.page + 1));
		paginationContainer.appendChild(nextBtn);
	}

	function chargerPage(page) {
		currentPage = page;
		// Recharger avec les filtres actuels
		chargerAvecFiltres(currentFilters, page);
		resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function afficherMessage(texte) {
		message.textContent = texte;
		message.hidden = false;
	}

	// Spinner buttons
	document.querySelectorAll('.ab-spinner-btn').forEach(btn => {
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			const input = this.closest('.ab-number-input').querySelector('input[type="number"]');
			const step = input.step || 1;
			const val = parseFloat(input.value) || 0;

			if (this.dataset.action === 'increment') {
				input.value = val + parseInt(step);
			} else {
				input.value = Math.max(val - parseInt(step), parseInt(input.min || 0));
			}
			input.dispatchEvent(new Event('change', { bubbles: true }));
		});
	});

	// Tri des bateaux
	let bateauxActuels = [];

	const originalAfficherBateaux = afficherBateaux;
	afficherBateaux = function(data) {
		// Stocker les bateaux actuels
		if (data.bateaux) {
			bateauxActuels = [...data.bateaux];
		} else if (Array.isArray(data)) {
			bateauxActuels = [...data];
		}

		// Appeler la fonction originale
		originalAfficherBateaux.call(this, data);
	};

	function afficherBateauxTries(bateauxTries) {
		resultsGrid.innerHTML = '';
		bateauxTries.forEach(bateau => {
			const card = document.createElement('div');
			card.className = 'ab-yacht-card';
			const titre = bateau.model || bateau.titre;
			const prix = bateau.prix_euros ? bateau.prix_euros.toLocaleString('en-US') : 'N/A';
			const localisation = bateau.localisation || 'Location';
			const imageUrl = bateau.image_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3Ctext x='150' y='100' font-size='16' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3E${titre}%3C/text%3E%3C/svg%3E`;

			card.innerHTML = `
				<div class="ab-yacht-image">
					<img src="${imageUrl}" alt="${titre}">
				</div>
				<div class="ab-yacht-body">
					<h3 class="ab-yacht-title">${titre}</h3>
					<p class="ab-yacht-price" data-price-euros="${bateau.prix_euros || 0}">${prix}&nbsp;€</p>
					<div class="ab-yacht-location">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
						<span>${localisation}</span>
					</div>
					<a href="${bateau.lien}" class="ab-yacht-btn">More Information</a>
				</div>
			`;
			resultsGrid.appendChild(card);
		});
	}

	const sortSelect = document.getElementById('ab-sort-select');
	sortSelect.addEventListener('change', function() {
		const sortType = this.value;
		if (!sortType || bateauxActuels.length === 0) return;

		let bateauxTries = [...bateauxActuels];

		if (sortType === 'price_low_high') {
			bateauxTries.sort((a, b) => (a.prix_euros || 0) - (b.prix_euros || 0));
		} else if (sortType === 'price_high_low') {
			bateauxTries.sort((a, b) => (b.prix_euros || 0) - (a.prix_euros || 0));
		} else if (sortType === 'newest') {
			bateauxTries.sort((a, b) => b.id - a.id);
		} else if (sortType === 'oldest') {
			bateauxTries.sort((a, b) => a.id - b.id);
		}

		// Réafficher les bateaux triés
		afficherBateauxTries(bateauxTries);
	});

	/* ===== FEATURED SLIDER (bateaux "à la une") ===== */
	const featuredSection = document.querySelector('.ab-featured-section');
	const featuredSlider  = document.getElementById('ab-featured-slider');
	const featuredDots    = document.getElementById('ab-featured-dots');
	const featuredPrevBtn = document.getElementById('ab-featured-prev');
	const featuredNextBtn = document.getElementById('ab-featured-next');
	const FEATURED_PAR_SLIDE = 4;

	let featuredSlides = [];
	let featuredIndex = 0;

	function creerCarteBateau(bateau, isFeatured = false) {
		const card = document.createElement('div');
		card.className = 'ab-yacht-card';
		const titre = bateau.model || bateau.titre;
		const prix = bateau.prix_euros ? bateau.prix_euros.toLocaleString('en-US') : 'N/A';
		const localisation = bateau.localisation || 'Location';
		const imageUrl = bateau.image_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23888' width='300' height='200'/%3E%3Ctext x='150' y='100' font-size='16' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3E${titre}%3C/text%3E%3C/svg%3E`;

		card.innerHTML = `
			<div class="ab-yacht-image">
				<img src="${imageUrl}" alt="${titre}">
				${isFeatured ? '<div class="ab-featured-badge">Featured</div>' : ''}
			</div>
			<div class="ab-yacht-body">
				<h3 class="ab-yacht-title">${titre}</h3>
				<p class="ab-yacht-price" data-price-euros="${bateau.prix_euros || 0}">${prix}&nbsp;€</p>
				<div class="ab-yacht-location">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
						<circle cx="12" cy="10" r="3"></circle>
					</svg>
					<span>${localisation}</span>
				</div>
				<a href="${bateau.lien}" class="ab-yacht-btn">More Information</a>
			</div>
		`;
		return card;
	}

	function afficherSlideFeatured() {
		const slide = featuredSlides[featuredIndex] || [];

		featuredSlider.innerHTML = '';
		slide.forEach(bateau => featuredSlider.appendChild(creerCarteBateau(bateau, true)));

		featuredPrevBtn.disabled = featuredIndex === 0;
		featuredNextBtn.disabled = featuredIndex === featuredSlides.length - 1;

		featuredDots.querySelectorAll('.ab-featured-dot').forEach((dot, i) => {
			dot.classList.toggle('active', i === featuredIndex);
		});
	}

	function initFeaturedDots() {
		featuredDots.innerHTML = '';
		featuredSlides.forEach((_, i) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'ab-featured-dot';
			dot.addEventListener('click', () => {
				if (i === featuredIndex) return;
				featuredIndex = i;
				afficherSlideFeatured();
			});
			featuredDots.appendChild(dot);
		});
	}

	featuredPrevBtn.addEventListener('click', () => {
		if (featuredIndex > 0) {
			featuredIndex--;
			afficherSlideFeatured();
		}
	});

	featuredNextBtn.addEventListener('click', () => {
		if (featuredIndex < featuredSlides.length - 1) {
			featuredIndex++;
			afficherSlideFeatured();
		}
	});

	fetch(endpointAlaUne)
		.then(r => r.json())
		.then(bateaux => {
			if (!Array.isArray(bateaux) || bateaux.length === 0) {
				featuredSection.hidden = true;
				return;
			}

			featuredSlides = [];
			for (let i = 0; i < bateaux.length; i += FEATURED_PAR_SLIDE) {
				featuredSlides.push(bateaux.slice(i, i + FEATURED_PAR_SLIDE));
			}

			initFeaturedDots();
			afficherSlideFeatured();
		})
		.catch(() => {
			featuredSection.hidden = true;
		});
})();


// ===== CHARTER: recherche contacts maritimes =====
(function () {
	var endpointRecherche = AnnuaireUnifieeVars.maritime.recherche;
	var endpointPays      = AnnuaireUnifieeVars.maritime.pays;
	var endpointParPays   = AnnuaireUnifieeVars.maritime.parPays;
	var endpointTypes     = AnnuaireUnifieeVars.maritime.types;
	var endpointParType   = AnnuaireUnifieeVars.maritime.parType;

	/* ---- Zone de résultats commune aux trois modes ---- */
	var resultats = document.getElementById('am-resultats');
	var message   = document.getElementById('am-message');
	var filtres   = [];

	function viderResultats() {
		resultats.hidden = true;
		resultats.innerHTML = '';
		message.hidden = true;
	}

	function afficherContacts(contacts, texteVide) {
		resultats.innerHTML = '';

		if (!Array.isArray(contacts) || contacts.length === 0) {
			resultats.hidden = true;
			message.textContent = texteVide;
			message.hidden = false;
			return;
		}

		message.textContent = contacts.length + ' contact' + (contacts.length > 1 ? 's' : '');
		message.hidden = false;

		contacts.forEach(function (c) {
			resultats.appendChild(creerLigneContact(c));
		});
		resultats.hidden = false;
	}

	/* ---- Fabrique une image de drapeau ---- */
	function creerDrapeau(p) {
		var flag = document.createElement('img');
		flag.className = 'am-flag';
		flag.src = 'https://flagcdn.com/h20/' + p.code + '.png';
		flag.srcset = 'https://flagcdn.com/h40/' + p.code + '.png 2x';
		flag.alt = p.label;
		flag.title = p.label;
		flag.loading = 'lazy';
		return flag;
	}

	/* ---- Fabrique une ligne de contact (drapeau + nom / type / bouton message) ---- */
	function creerLigneContact(c) {
		var li = document.createElement('li');
		var a  = document.createElement('a');
		a.href = c.lien;

		// Colonne 1 : drapeau(x) + nom
		var colContact = document.createElement('span');
		colContact.className = 'am-col am-col-contact';

		if (Array.isArray(c.pays)) {
			c.pays.forEach(function (p) {
				colContact.appendChild(creerDrapeau(p));
			});
		}

		var titre = document.createElement('strong');
		titre.textContent = (c.prenom + ' ' + c.nom).trim();
		colContact.appendChild(titre);

		a.appendChild(colContact);

		// Colonne 2 : type de contact
		var colType = document.createElement('span');
		colType.className = 'am-col am-col-type';
		if (c.type) {
			var detail = document.createElement('span');
			detail.className = 'am-detail';
			detail.textContent = c.type;
			colType.appendChild(detail);
		}
		a.appendChild(colType);

		// Colonne 3 : faux bouton "Send message"
		var colCta = document.createElement('span');
		colCta.className = 'am-col am-col-cta';

		var bouton = document.createElement('span');
		bouton.className = 'am-send-btn';
		bouton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 9L12 13l6-4"></path></svg><span>Send message</span>';
		colCta.appendChild(bouton);

		a.appendChild(colCta);

		li.appendChild(a);
		return li;
	}

	/* =====================================================
	   BLOC 1 : recherche par nom / prénom
	   ===================================================== */
	var input      = document.getElementById('am-recherche-input');
	var timer      = null;
	var controller = null;

	function reinitialiserRecherche() {
		clearTimeout(timer);
		if (controller) controller.abort();
		input.value = '';
		viderResultats();
	}

	// Sélectionner ce champ efface les résultats des filtres pays / type
	input.addEventListener('focus', function () {
		filtres.forEach(function (f) { f.reinitialiser(); });
	});

	input.addEventListener('input', function () {
		var terme = input.value.trim();

		clearTimeout(timer);

		// Moins de 3 caractères : on efface les résultats
		if (terme.length < 3) {
			viderResultats();
			if (controller) controller.abort();
			return;
		}

		// Debounce 250 ms pour ne pas surcharger le serveur
		timer = setTimeout(function () {
			if (controller) controller.abort(); // annule la requête précédente
			controller = new AbortController();

			fetch(endpointRecherche + '?terme=' + encodeURIComponent(terme), {
				signal: controller.signal
			})
			.then(function (r) { return r.json(); })
			.then(function (contacts) {
				afficherContacts(contacts, 'Aucun contact trouvé.');
			})
			.catch(function (err) {
				if (err.name !== 'AbortError') {
					viderResultats();
					message.textContent = 'Erreur lors de la recherche.';
					message.hidden = false;
				}
			});
		}, 250);
	});

	/* =====================================================
	   FILTRES DÉROULANTS GÉNÉRIQUES (pays, type de contact)
	   ===================================================== */

	/**
	 * cfg = {
	 *   boutonId, listeId,
	 *   urlOptions   : URL renvoyant la liste des options,
	 *   urlContacts  : function(option) -> URL des contacts,
	 *   renderOption : function(option, conteneur) -> remplit l'option,
	 *   messageVide  : texte si aucune option disponible
	 * }
	 */
	function initFiltre(cfg) {
		var bouton      = document.getElementById(cfg.boutonId);
		var listeEl     = document.getElementById(cfg.listeId);
		var charges     = false;
		var labelDefaut = bouton.innerHTML;

		function fermer() {
			listeEl.hidden = true;
			bouton.setAttribute('aria-expanded', 'false');
		}

		function reinitialiser() {
			fermer();
			bouton.innerHTML = labelDefaut;
			viderResultats();
		}

		function choisir(option) {
			fermer();

			// Le bouton affiche l'option sélectionnée
			bouton.innerHTML = '';
			cfg.renderOption(option, bouton);

			viderResultats();
			message.textContent = 'Chargement…';
			message.hidden = false;

			fetch(cfg.urlContacts(option))
			.then(function (r) { return r.json(); })
			.then(function (contacts) {
				afficherContacts(contacts, 'Aucun contact trouvé.');
			})
			.catch(function () {
				message.textContent = 'Erreur lors du chargement des contacts.';
				message.hidden = false;
			});
		}

		function charger() {
			return fetch(cfg.urlOptions)
			.then(function (r) { return r.json(); })
			.then(function (options) {
				listeEl.innerHTML = '';

				if (!Array.isArray(options) || options.length === 0) {
					var vide = document.createElement('li');
					vide.className = 'am-option';
					vide.textContent = cfg.messageVide;
					listeEl.appendChild(vide);
					return;
				}

				// Bouton "Effacer" en tête de liste
				var reset = document.createElement('li');
				reset.className = 'am-option am-option-reset';
				reset.setAttribute('role', 'option');
				reset.tabIndex = 0;
				reset.textContent = '✕ Effacer le filtre';
				reset.addEventListener('click', reinitialiser);
				reset.addEventListener('keydown', function (e) {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						reinitialiser();
					}
				});
				listeEl.appendChild(reset);

				options.forEach(function (option) {
					var li = document.createElement('li');
					li.className = 'am-option';
					li.setAttribute('role', 'option');
					li.tabIndex = 0;
					cfg.renderOption(option, li);

					li.addEventListener('click', function () { choisir(option); });
					li.addEventListener('keydown', function (e) {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							choisir(option);
						}
					});

					listeEl.appendChild(li);
				});

				charges = true;
			});
		}

		bouton.addEventListener('click', function () {
			if (!listeEl.hidden) {
				fermer();
				return;
			}

			// Sélectionner ce filtre efface la recherche et les autres filtres
			reinitialiserRecherche();
			filtres.forEach(function (f) { if (f.fermer !== fermer) f.reinitialiser(); });

			var ouvrir = function () {
				listeEl.hidden = false;
				bouton.setAttribute('aria-expanded', 'true');
			};

			if (charges) {
				ouvrir();
			} else {
				charger().then(ouvrir).catch(function () {
					message.textContent = 'Impossible de charger la liste.';
					message.hidden = false;
				});
			}
		});

		filtres.push({
			fermer:        fermer,
			reinitialiser: reinitialiser,
			boutonId:      cfg.boutonId,
			listeId:       cfg.listeId
		});
	}

	/* ---- Filtre par pays (drapeau + nom) ---- */
	initFiltre({
		boutonId:    'am-pays-bouton',
		listeId:     'am-pays-liste',
		urlOptions:  endpointPays,
		messageVide: 'Aucun pays disponible.',
		urlContacts: function (p) {
			return endpointParPays + '?code=' + encodeURIComponent(p.code);
		},
		renderOption: function (p, conteneur) {
			conteneur.appendChild(creerDrapeau(p));
			conteneur.appendChild(document.createTextNode(p.label));
		}
	});

	/* ---- Filtre par type de contact (taxonomie) ---- */
	initFiltre({
		boutonId:    'am-type-bouton',
		listeId:     'am-type-liste',
		urlOptions:  endpointTypes,
		messageVide: 'Aucun type de contact disponible.',
		urlContacts: function (t) {
			return endpointParType + '?type=' + encodeURIComponent(t.slug);
		},
		renderOption: function (t, conteneur) {
			conteneur.appendChild(document.createTextNode(t.label));
			if (typeof t.count === 'number' && conteneur.tagName === 'LI') {
				var compte = document.createElement('span');
				compte.className = 'am-compte';
				compte.textContent = ' (' + t.count + ')';
				conteneur.appendChild(compte);
			}
		}
	});

	/* Ferme les déroulantes si on clique ailleurs */
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.am-recherche')) {
			filtres.forEach(function (f) { f.fermer(); });
			return;
		}
		filtres.forEach(function (f) {
			if (!e.target.closest('#' + f.boutonId) && !e.target.closest('#' + f.listeId)) {
				f.fermer();
			}
		});
	});
})();
