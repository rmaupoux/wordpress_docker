( function () {
	var STOCKAGE_CLE = 'amActivitiesVue';

	document.addEventListener( 'DOMContentLoaded', function () {
		var toggle = document.querySelector( '.am-activities-view-toggle' );
		var grille = document.querySelector( '.am-activities-grid' );

		if ( ! toggle || ! grille ) {
			return;
		}

		var boutons = toggle.querySelectorAll( 'button[data-view]' );

		function appliquerVue( vue ) {
			grille.classList.toggle( 'am-activities-grid--list', vue === 'list' );

			boutons.forEach( function ( bouton ) {
				var actif = bouton.getAttribute( 'data-view' ) === vue;
				bouton.classList.toggle( 'is-active', actif );
				bouton.setAttribute( 'aria-pressed', actif ? 'true' : 'false' );
			} );
		}

		boutons.forEach( function ( bouton ) {
			bouton.addEventListener( 'click', function () {
				var vue = bouton.getAttribute( 'data-view' );
				appliquerVue( vue );
				try {
					window.localStorage.setItem( STOCKAGE_CLE, vue );
				} catch ( e ) {
					// stockage indisponible (navigation privée, etc.) : on ignore
				}
			} );
		} );

		var vueSauvegardee = null;
		try {
			vueSauvegardee = window.localStorage.getItem( STOCKAGE_CLE );
		} catch ( e ) {
			vueSauvegardee = null;
		}

		if ( vueSauvegardee === 'list' || vueSauvegardee === 'grid' ) {
			appliquerVue( vueSauvegardee );
		}
	} );
} )();
