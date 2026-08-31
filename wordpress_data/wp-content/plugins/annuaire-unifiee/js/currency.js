/**
 * Sélecteur de devise pour les prix bateaux (annuaire-bateau).
 *
 * Chargé sur toutes les pages qui affichent des cartes bateau (formulaire de
 * recherche, fiche bateau, archive par type, grille "Yachts for sale" d'un
 * contact), voir includes/class-plugin.php. Chaque carte porte le prix brut
 * en EUR dans data-price-euros (attribut ajouté par pods-template-helpers.php,
 * includes/shortcodes/bateaux.php et script.js) ; ce script se contente de le
 * reformater dans la devise choisie, sans jamais toucher au DOM au-delà des
 * éléments .ab-yacht-price.
 *
 * Le filtre par prix (#ab-price-min / #ab-price-max, dans script.js) continue
 * d'interroger l'API en EUR : window.AbCurrency expose toEuros()/fromEUR() pour
 * que script.js convertisse les valeurs saisies avant l'appel REST.
 */
(function () {
	var devisesVars = window.AnnuaireUnifieeDevises || {};
	var taux = devisesVars.taux || { USD: 1 };

	var DEVISES = {
		USD: '$',
		EUR: '€',
		GBP: '£',
		CHF: 'CHF',
		AED: 'AED',
	};

	var CLE_STOCKAGE = 'ab_devise';
	var deviseCourante = localStorage.getItem( CLE_STOCKAGE ) || 'EUR';

	if ( ! taux[ deviseCourante ] ) {
		deviseCourante = 'EUR';
	}

	function convertirDepuisEUR( montantEUR, devise ) {
		return montantEUR * ( taux[ devise ] || 1 );
	}

	function convertirVersEUR( montant, devise ) {
		return montant / ( taux[ devise ] || 1 );
	}

	function formater( montantEUR, devise ) {
		if ( montantEUR === null || isNaN( montantEUR ) ) {
			return 'N/A';
		}

		var montant = Math.round( convertirDepuisEUR( montantEUR, devise ) );

		return montant.toLocaleString( 'en-US' ) + ' ' + ( DEVISES[ devise ] || devise );
	}

	function formaterToutesLesCartes() {
		document.querySelectorAll( '.ab-yacht-price[data-price-euros]' ).forEach( function ( el ) {
			var euros = parseFloat( el.getAttribute( 'data-price-euros' ) );
			el.textContent = formater( euros, deviseCourante );
		} );
	}

	// Convertit les valeurs déjà saisies dans le filtre prix (script.js) pour
	// qu'elles restent cohérentes quand on change de devise après les avoir remplies.
	function convertirChampsFiltre( devisePrecedente ) {
		[ 'ab-price-min', 'ab-price-max' ].forEach( function ( id ) {
			var input = document.getElementById( id );
			if ( ! input || input.value === '' ) {
				return;
			}
			var euros = convertirVersEUR( parseFloat( input.value ), devisePrecedente );
			input.value = Math.round( convertirDepuisEUR( euros, deviseCourante ) );
		} );
	}

	function definirDevise( devise ) {
		if ( ! taux[ devise ] || devise === deviseCourante ) {
			return;
		}

		var precedente = deviseCourante;
		deviseCourante = devise;
		localStorage.setItem( CLE_STOCKAGE, devise );

		convertirChampsFiltre( precedente );
		formaterToutesLesCartes();

		document.querySelectorAll( '#ab-currency-select' ).forEach( function ( select ) {
			select.value = devise;
			synchroniserTrigger( select );
		} );
	}

	// Le select brut de #ab-currency-select peut être doublé d'un habillage
	// "custom select" (voir CustomSelect dans script.js, qui n'affiche jamais lui
	// -même la valeur courante du <select> natif dans son bouton) : on met à jour
	// ce bouton directement, sans dépendre de cette classe.
	function synchroniserTrigger( select ) {
		var wrapper = select.closest( '.ab-select-wrapper' );
		if ( ! wrapper ) {
			return;
		}
		var trigger = wrapper.querySelector( '.ab-select-trigger' );
		var option = select.options[ select.selectedIndex ];
		if ( trigger && option ) {
			trigger.textContent = option.textContent;
		}
	}

	function peuplerSelect( select ) {
		if ( select.options.length ) {
			return;
		}

		Object.keys( DEVISES ).forEach( function ( code ) {
			if ( ! taux[ code ] ) {
				return;
			}
			var option = document.createElement( 'option' );
			option.value = code;
			option.textContent = code;
			select.appendChild( option );
		} );
	}

	// Injecte un sélecteur autonome sur les pages sans formulaire de recherche
	// (fiche bateau, archive par type, grille "Yachts for sale" d'un contact),
	// juste avant la première grille de cartes trouvée.
	function injecterSelecteur() {
		var section = document.querySelector( '.annuaire-yachts-section, .ab-featured-section' );
		var parent, avant;

		if ( section ) {
			parent = section;
			avant = section.firstElementChild;
		} else {
			var grille = document.querySelector( '.ab-results-grid' );
			if ( ! grille ) {
				return;
			}
			parent = grille.parentElement;
			avant = grille;
		}

		var switcher = document.createElement( 'div' );
		switcher.className = 'ab-currency-switcher';

		var label = document.createElement( 'label' );
		label.setAttribute( 'for', 'ab-currency-select' );
		label.textContent = 'Currency';

		var select = document.createElement( 'select' );
		select.id = 'ab-currency-select';
		select.className = 'ab-currency-native-select';
		peuplerSelect( select );
		select.value = deviseCourante;

		switcher.appendChild( label );
		switcher.appendChild( select );
		parent.insertBefore( switcher, avant );
	}

	function initSelecteur() {
		var select = document.getElementById( 'ab-currency-select' );

		if ( ! select ) {
			injecterSelecteur();
			select = document.getElementById( 'ab-currency-select' );
		} else {
			peuplerSelect( select );
			select.value = deviseCourante;
			synchroniserTrigger( select );
		}

		if ( ! select ) {
			return;
		}

		select.addEventListener( 'change', function () {
			definirDevise( this.value );
		} );
	}

	// script.js remplace entièrement le contenu de ces conteneurs (résultats de
	// recherche, tri, carrousel "à la une") : observer leurs enfants directs
	// suffit, sans subtree, pour éviter de se redéclencher soi-même en modifiant
	// le texte des .ab-yacht-price qu'ils contiennent.
	function observerConteneursDynamiques() {
		[ 'ab-results-grid', 'ab-featured-slider', 'ab-fbc-slider' ].forEach( function ( id ) {
			var el = document.getElementById( id );
			if ( ! el ) {
				return;
			}
			new MutationObserver( formaterToutesLesCartes ).observe( el, { childList: true } );
		} );
	}

	function init() {
		initSelecteur();
		formaterToutesLesCartes();
		observerConteneursDynamiques();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

	window.AbCurrency = {
		get: function () {
			return deviseCourante;
		},
		set: definirDevise,
		toEuros: function ( montant ) {
			return convertirVersEUR( montant, deviseCourante );
		},
		fromEUR: function ( montantEUR ) {
			return convertirDepuisEUR( montantEUR, deviseCourante );
		},
		format: function ( montantEUR ) {
			return formater( montantEUR, deviseCourante );
		},
	};
})();
