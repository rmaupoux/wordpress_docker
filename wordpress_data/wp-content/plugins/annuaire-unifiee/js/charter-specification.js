/**
 * Affiche/masque en direct la metabox Pods "Charter Specification" (Crew /
 * Guest cruising / Guest sleeping) sur l'écran d'édition d'une fiche bateau,
 * selon que le terme "rent" de la taxonomie type_d_achat est coché.
 *
 * Fait exclusivement côté client (l'éditeur par blocs fige la liste des
 * metaboxes affichées au chargement initial de la page : les masquer côté
 * PHP avec remove_meta_box() les empêche définitivement de réapparaître tant
 * que la page n'est pas rechargée, y compris juste après avoir coché Rent et
 * enregistré) : la metabox reste donc toujours enregistrée côté PHP, et ce
 * script se contente de la cacher/montrer en CSS.
 */
( function( wp ) {
	if ( ! wp || ! wp.data || ! wp.domReady || typeof AnnuaireUnifieeCharter === 'undefined' ) {
		return;
	}

	function getMetaBox() {
		return document.getElementById( AnnuaireUnifieeCharter.metaBoxId );
	}

	function estEnLocation() {
		var termes = wp.data.select( 'core/editor' ).getEditedPostAttribute( AnnuaireUnifieeCharter.taxonomy );

		// wp_localize_script transmet termIdRent en chaîne ("39"), alors que
		// getEditedPostAttribute renvoie des ID numériques : parseInt() évite
		// que la comparaison stricte d'indexOf() échoue silencieusement.
		var idRent = parseInt( AnnuaireUnifieeCharter.termIdRent, 10 );

		return Array.isArray( termes ) && -1 !== termes.indexOf( idRent );
	}

	function appliquerVisibilite() {
		var metaBox = getMetaBox();

		if ( ! metaBox ) {
			return;
		}

		metaBox.style.display = estEnLocation() ? '' : 'none';
	}

	wp.domReady( function() {
		appliquerVisibilite();
		wp.data.subscribe( appliquerVisibilite );
	} );
} )( window.wp );
