( function () {
	document.addEventListener( 'DOMContentLoaded', function () {
		var sliders = document.querySelectorAll( '[data-am-home-slider]' );

		sliders.forEach( function ( slider ) {
			var piste            = slider.querySelector( '.am-home-slider-track' );
			var diapos           = slider.querySelectorAll( '.am-home-slide' );
			var precedent        = slider.querySelector( '.am-home-slider-prev' );
			var suivant          = slider.querySelector( '.am-home-slider-next' );
			var pointsConteneur  = slider.querySelector( '.am-home-slider-dots' );

			if ( ! piste || diapos.length < 2 ) {
				return;
			}

			var index  = 0;
			var points = [];
			var minuteur;

			diapos.forEach( function ( diapo, i ) {
				var point = document.createElement( 'button' );
				point.type = 'button';
				point.setAttribute( 'aria-label', 'Aller à l\'article ' + ( i + 1 ) );
				point.addEventListener( 'click', function () {
					allerA( i );
				} );
				pointsConteneur.appendChild( point );
				points.push( point );
			} );

			function allerA( nouvelIndex ) {
				index = ( nouvelIndex + diapos.length ) % diapos.length;
				piste.style.transform = 'translateX(-' + ( index * 100 ) + '%)';
				points.forEach( function ( point, i ) {
					point.classList.toggle( 'is-active', i === index );
				} );
			}

			function demarrerAutoplay() {
				minuteur = setInterval( function () {
					allerA( index + 1 );
				}, 6000 );
			}

			if ( precedent ) {
				precedent.addEventListener( 'click', function () { allerA( index - 1 ); } );
			}
			if ( suivant ) {
				suivant.addEventListener( 'click', function () { allerA( index + 1 ); } );
			}

			slider.addEventListener( 'mouseenter', function () { clearInterval( minuteur ); } );
			slider.addEventListener( 'mouseleave', demarrerAutoplay );

			allerA( 0 );
			demarrerAutoplay();
		} );
	} );
} )();
