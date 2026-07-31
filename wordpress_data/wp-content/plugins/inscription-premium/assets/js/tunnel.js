/**
 * Navigation entre étapes, validations, upload AJAX, appel Stripe.
 * Vanilla JS, aucune dépendance : chaque bloc ne s'exécute que si son
 * marqueur (data-ip-step / data-ip-tab) est présent sur la page.
 */
( function () {
	'use strict';

	if ( typeof window.ipTunnel === 'undefined' ) {
		return;
	}

	var config = window.ipTunnel;

	function apiFetch( path, options ) {
		options = options || {};
		options.headers = Object.assign( {}, options.headers, { 'X-WP-Nonce': config.nonce } );

		return fetch( config.restUrl + path, options ).then( function ( response ) {
			return response.json().then( function ( data ) {
				if ( ! response.ok ) {
					return Promise.reject( data );
				}

				return data;
			} );
		} );
	}

	function showError( el, error ) {
		if ( ! el ) {
			return;
		}

		el.textContent = ( error && error.message ) ? error.message : config.i18n.genericError;
		el.hidden = false;
	}

	/**
	 * Transforme un FormData avec des clés "section[field]" en objet imbriqué
	 * { section: { field: value } }.
	 */
	function formToNestedObject( form ) {
		var result = {};
		var formData = new FormData( form );

		formData.forEach( function ( value, key ) {
			var match = key.match( /^([^\[]+)\[([^\]]+)\]$/ );

			if ( match ) {
				result[ match[1] ] = result[ match[1] ] || {};
				result[ match[1] ][ match[2] ] = value;
			} else {
				result[ key ] = value;
			}
		} );

		return result;
	}

	/* ---------------------------------------------------------------------
	 * Auth : onglets connexion / inscription / mot de passe oublié
	 * ------------------------------------------------------------------ */
	var authTabs = document.querySelectorAll( '.ip-auth-tab' );

	if ( authTabs.length ) {
		authTabs.forEach( function ( tab ) {
			tab.addEventListener( 'click', function () {
				authTabs.forEach( function ( t ) {
					t.classList.remove( 'active' );
				} );
				tab.classList.add( 'active' );

				document.querySelectorAll( '.ip-auth-panel' ).forEach( function ( panel ) {
					panel.hidden = panel.dataset.ipPanel !== tab.dataset.ipTab;
				} );
			} );
		} );
	}

	/* ---------------------------------------------------------------------
	 * Plans d'abonnement
	 * ------------------------------------------------------------------ */
	document.querySelectorAll( '.ip-subscribe-btn' ).forEach( function ( button ) {
		button.addEventListener( 'click', function () {
			button.disabled = true;

			var body = new URLSearchParams();
			body.set( 'action', 'ip_subscribe_plan' );
			body.set( 'nonce', config.nonce );
			body.set( 'plan', button.dataset.plan );

			fetch( config.ajaxUrl, { method: 'POST', body: body } )
				.then( function ( r ) { return r.json(); } )
				.then( function ( res ) {
					if ( res.success ) {
						window.location.reload();
					} else {
						button.disabled = false;
						alert( ( res.data && res.data.message ) || config.i18n.genericError );
					}
				} );
		} );
	} );

	/* ---------------------------------------------------------------------
	 * Étape 1 — Type
	 * ------------------------------------------------------------------ */
	var step1 = document.querySelector( '[data-ip-step="1"]' );

	if ( step1 ) {
		var typeCards = step1.querySelectorAll( '.ip-type-card' );
		var nextBtn1 = document.getElementById( 'ip-step1-next' );
		var selectedTerm = null;

		typeCards.forEach( function ( card ) {
			if ( card.classList.contains( 'is-selected' ) ) {
				selectedTerm = card.dataset.termId;
			}

			card.addEventListener( 'click', function () {
				typeCards.forEach( function ( c ) { c.classList.remove( 'is-selected' ); } );
				card.classList.add( 'is-selected' );
				selectedTerm = card.dataset.termId;
				nextBtn1.disabled = false;
			} );
		} );

		if ( selectedTerm ) {
			nextBtn1.disabled = false;
		}

		nextBtn1.addEventListener( 'click', function () {
			nextBtn1.disabled = true;

			apiFetch( '/tunnel/step/1', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { type: selectedTerm } ),
			} ).then( function ( data ) {
				window.location.href = data.next;
			} ).catch( function ( error ) {
				nextBtn1.disabled = false;
				alert( ( error && error.message ) || config.i18n.genericError );
			} );
		} );
	}

	/* ---------------------------------------------------------------------
	 * Étape 2 — Specifications
	 * ------------------------------------------------------------------ */
	var step2Form = document.getElementById( 'ip-step2-form' );

	if ( step2Form ) {
		var error2 = document.getElementById( 'ip-step2-error' );

		step2Form.addEventListener( 'submit', function ( event ) {
			event.preventDefault();
			error2.hidden = true;

			var submitButton = step2Form.querySelector( 'button[type="submit"]' );
			submitButton.disabled = true;

			apiFetch( '/tunnel/step/2', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( formToNestedObject( step2Form ) ),
			} ).then( function ( data ) {
				window.location.href = data.next;
			} ).catch( function ( err ) {
				submitButton.disabled = false;
				showError( error2, err );
			} );
		} );
	}

	/* ---------------------------------------------------------------------
	 * Étape 3 — Pictures (drag & drop + preview)
	 * ------------------------------------------------------------------ */
	var step3 = document.querySelector( '[data-ip-step="3"]' );

	if ( step3 ) {
		var dropzone = document.getElementById( 'ip-photo-dropzone' );
		var fileInput = document.getElementById( 'ip-photo-input' );
		var grid = document.getElementById( 'ip-photo-grid' );
		var nextBtn3 = document.getElementById( 'ip-step3-next' );
		var error3 = document.getElementById( 'ip-step3-error' );
		var minPhotos = 3;

		function photoCount() {
			return grid.querySelectorAll( '.ip-photo-item' ).length;
		}

		function refreshCoverBadge() {
			grid.querySelectorAll( '.ip-photo-item' ).forEach( function ( item, index ) {
				item.classList.toggle( 'is-cover', 0 === index );
			} );
		}

		function refreshNextState() {
			nextBtn3.disabled = photoCount() < minPhotos;
		}

		function addPhotoToGrid( id, url ) {
			var item = document.createElement( 'div' );
			item.className = 'ip-photo-item';
			item.dataset.attachmentId = id;
			item.innerHTML = '<img src="' + url + '" alt="" /><button type="button" class="ip-photo-remove" aria-label="Remove">&times;</button>';

			item.querySelector( '.ip-photo-remove' ).addEventListener( 'click', function () {
				apiFetch( '/tunnel/step/3/remove', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( { id: id } ),
				} ).then( function () {
					item.remove();
					refreshCoverBadge();
					refreshNextState();
				} );
			} );

			grid.appendChild( item );
			refreshCoverBadge();
			refreshNextState();
		}

		function uploadFiles( files ) {
			Array.prototype.forEach.call( files, function ( file ) {
				var body = new FormData();
				body.append( 'file', file );

				apiFetch( '/tunnel/step/3/upload', { method: 'POST', body: body } )
					.then( function ( data ) {
						addPhotoToGrid( data.id, data.url );
					} )
					.catch( function ( err ) {
						showError( error3, err );
					} );
			} );
		}

		// Photos déjà uploadées lors d'une visite précédente (draft repris).
		grid.querySelectorAll( '.ip-photo-item' ).forEach( function ( item ) {
			var id = item.dataset.attachmentId;

			item.querySelector( '.ip-photo-remove' ).addEventListener( 'click', function () {
				apiFetch( '/tunnel/step/3/remove', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( { id: id } ),
				} ).then( function () {
					item.remove();
					refreshCoverBadge();
					refreshNextState();
				} );
			} );
		} );

		refreshNextState();

		dropzone.addEventListener( 'click', function () {
			fileInput.click();
		} );

		fileInput.addEventListener( 'change', function () {
			uploadFiles( fileInput.files );
			fileInput.value = '';
		} );

		[ 'dragenter', 'dragover' ].forEach( function ( evtName ) {
			dropzone.addEventListener( evtName, function ( e ) {
				e.preventDefault();
				dropzone.classList.add( 'is-dragover' );
			} );
		} );

		[ 'dragleave', 'drop' ].forEach( function ( evtName ) {
			dropzone.addEventListener( evtName, function ( e ) {
				e.preventDefault();
				dropzone.classList.remove( 'is-dragover' );
			} );
		} );

		dropzone.addEventListener( 'drop', function ( e ) {
			if ( e.dataTransfer && e.dataTransfer.files.length ) {
				uploadFiles( e.dataTransfer.files );
			}
		} );

		nextBtn3.addEventListener( 'click', function () {
			if ( photoCount() < minPhotos ) {
				showError( error3, { message: config.i18n.minPhotos } );

				return;
			}

			nextBtn3.disabled = true;

			apiFetch( '/tunnel/step/3/finish', { method: 'POST' } )
				.then( function ( data ) {
					window.location.href = data.next;
				} )
				.catch( function ( err ) {
					nextBtn3.disabled = false;
					showError( error3, err );
				} );
		} );
	}

	/* ---------------------------------------------------------------------
	 * Étape 4 — Period of validity
	 * ------------------------------------------------------------------ */
	var step4 = document.querySelector( '[data-ip-step="4"]' );

	if ( step4 ) {
		var nextBtn4 = document.getElementById( 'ip-step4-next' );
		var error4 = document.getElementById( 'ip-step4-error' );

		nextBtn4.addEventListener( 'click', function () {
			var selectedDuration = step4.querySelector( 'input[name="duration_days"]:checked' );

			if ( ! selectedDuration ) {
				showError( error4, { message: config.i18n.requiredField } );

				return;
			}

			nextBtn4.disabled = true;

			apiFetch( '/tunnel/step/4', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					duration_days: selectedDuration.value,
					addon_highlights: step4.querySelector( 'input[name="addon_highlights"]' ).checked ? 1 : 0,
				} ),
			} ).then( function ( data ) {
				window.location.href = data.next;
			} ).catch( function ( err ) {
				nextBtn4.disabled = false;
				showError( error4, err );
			} );
		} );
	}

	/* ---------------------------------------------------------------------
	 * Étape 5 — Payment
	 * ------------------------------------------------------------------ */
	var payBtn = document.getElementById( 'ip-step5-pay' );

	if ( payBtn ) {
		var error5 = document.getElementById( 'ip-step5-error' );

		payBtn.addEventListener( 'click', function () {
			payBtn.disabled = true;

			apiFetch( '/tunnel/step/5/checkout', { method: 'POST' } )
				.then( function ( data ) {
					window.location.href = data.free ? data.redirect : data.url;
				} )
				.catch( function ( err ) {
					payBtn.disabled = false;
					showError( error5, err );
				} );
		} );
	}
} )();
