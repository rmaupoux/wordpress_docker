<?php
/**
 * Plugin Name: Annuaire Maritime – Recherche instantanée
 * Description: Endpoints REST + shortcode [annuaire_recherche] : recherche par nom/prénom (dès le 3e caractère), filtre par pays (drapeaux) et filtre par type de contact (taxonomie) pour le CPT annuaire_maritime. Résultats affichés sous les trois colonnes.
 * Version: 1.5
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* Slug de la taxonomie associée au CPT (à ajuster si besoin). */
define( 'AM_TAXONOMIE_TYPE', 'type_de_contact' );

/* -------------------------------------------------------------------------
 * OUTILS
 * ---------------------------------------------------------------------- */

/**
 * Retourne la liste prédéfinie des pays de Pods : code ISO => libellé.
 * Ex. : 'FR' => 'France'. C'est cette liste qu'utilise le champ
 * relationnel "pays" (Related Type : Countries, groupe Predefined Lists).
 */
function am_liste_pays() {
	static $liste = null;

	if ( null === $liste ) {
		$liste = array();
		if ( class_exists( 'PodsForm' ) ) {
			$data = PodsForm::field_method( 'pick', 'data_countries' );
			if ( is_array( $data ) ) {
				$liste = $data;
			}
		}
	}

	return $liste;
}

/**
 * Transforme une liste de posts annuaire_maritime en tableau de contacts
 * pour la réponse REST (drapeaux : code ISO minuscule + libellé).
 */
function am_formater_contacts( $posts ) {
	$liste_pays = am_liste_pays();
	$resultats  = array();

	foreach ( $posts as $post ) {
		/* Le champ "pays" stocke le code ISO ('FR') : on renvoie le code
		   (pour le drapeau) et le libellé (pour l'infobulle / alt). */
		$codes = get_post_meta( $post->ID, 'pays', false ); // false = toutes les valeurs (multi-sélection possible)
		$pays  = array();

		foreach ( (array) $codes as $code ) {
			$sous_codes = is_array( $code ) ? $code : array( $code ); // valeur éventuellement sérialisée
			foreach ( $sous_codes as $c ) {
				if ( isset( $liste_pays[ $c ] ) && ! isset( $pays[ $c ] ) ) {
					$pays[ $c ] = array(
						'code'  => strtolower( $c ),
						'label' => $liste_pays[ $c ],
					);
				}
			}
		}

		$resultats[] = array(
			'id'        => $post->ID,
			'nom'       => get_post_meta( $post->ID, 'nom', true ),
			'prenom'    => get_post_meta( $post->ID, 'prenom', true ),
			'telephone' => get_post_meta( $post->ID, 'telephone', true ),
			'pays'      => array_values( $pays ),
			'lien'      => get_permalink( $post->ID ),
		);
	}

	return $resultats;
}

/* -------------------------------------------------------------------------
 * 1. ENDPOINTS REST
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', function () {

	/* Recherche par nom / prénom : /wp-json/annuaire/v1/recherche?terme=xxx */
	register_rest_route( 'annuaire/v1', '/recherche', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_recherche',
		'permission_callback' => '__return_true', // recherche publique
		'args'                => array(
			'terme' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => function ( $value ) {
					return mb_strlen( trim( $value ) ) >= 3;
				},
			),
		),
	) );

	/* Liste des pays réellement utilisés : /wp-json/annuaire/v1/pays */
	register_rest_route( 'annuaire/v1', '/pays', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_pays_utilises',
		'permission_callback' => '__return_true',
	) );

	/* Contacts d'un pays : /wp-json/annuaire/v1/par-pays?code=FR */
	register_rest_route( 'annuaire/v1', '/par-pays', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_par_pays',
		'permission_callback' => '__return_true',
		'args'                => array(
			'code' => array(
				'required'          => true,
				'sanitize_callback' => function ( $value ) {
					return strtoupper( sanitize_text_field( $value ) );
				},
				'validate_callback' => function ( $value ) {
					return (bool) preg_match( '/^[A-Za-z]{2}$/', $value );
				},
			),
		),
	) );

	/* Termes de la taxonomie type_de_contact : /wp-json/annuaire/v1/types */
	register_rest_route( 'annuaire/v1', '/types', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_types',
		'permission_callback' => '__return_true',
	) );

	/* Contacts d'un type : /wp-json/annuaire/v1/par-type?type=slug-du-terme */
	register_rest_route( 'annuaire/v1', '/par-type', array(
		'methods'             => 'GET',
		'callback'            => 'annuaire_maritime_par_type',
		'permission_callback' => '__return_true',
		'args'                => array(
			'type' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_title',
				'validate_callback' => function ( $value ) {
					return '' !== trim( $value );
				},
			),
		),
	) );
} );

/** Recherche par nom / prénom (10 résultats max). */
function annuaire_maritime_recherche( WP_REST_Request $request ) {
	$terme = trim( $request->get_param( 'terme' ) );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'nom',
				'value'   => $terme,
				'compare' => 'LIKE',
			),
			array(
				'key'     => 'prenom',
				'value'   => $terme,
				'compare' => 'LIKE',
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}

/**
 * Liste des pays présents dans l'annuaire (pour la liste déroulante),
 * triée par libellé. Seuls les pays ayant au moins un contact publié
 * sont proposés.
 */
function annuaire_maritime_pays_utilises() {
	global $wpdb;

	$codes = $wpdb->get_col( $wpdb->prepare(
		"SELECT DISTINCT pm.meta_value
		 FROM {$wpdb->postmeta} pm
		 INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
		 WHERE pm.meta_key = %s
		   AND p.post_type = %s
		   AND p.post_status = 'publish'",
		'pays',
		'annuaire_maritime'
	) );

	$liste_pays = am_liste_pays();
	$pays       = array();

	foreach ( (array) $codes as $code ) {
		$code = strtoupper( trim( (string) $code ) );
		if ( isset( $liste_pays[ $code ] ) && ! isset( $pays[ $code ] ) ) {
			$pays[ $code ] = array(
				'code'  => strtolower( $code ),
				'label' => $liste_pays[ $code ],
			);
		}
	}

	/* Tri alphabétique insensible aux accents */
	usort( $pays, function ( $a, $b ) {
		return strcasecmp( remove_accents( $a['label'] ), remove_accents( $b['label'] ) );
	} );

	return rest_ensure_response( array_values( $pays ) );
}

/** Tous les contacts liés à un pays donné. */
function annuaire_maritime_par_pays( WP_REST_Request $request ) {
	$code = $request->get_param( 'code' );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => -1, // tous les contacts du pays
		'orderby'        => 'title',
		'order'          => 'ASC',
		'meta_query'     => array(
			array(
				'key'     => 'pays',
				'value'   => $code,
				'compare' => '=',
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}

/**
 * Termes de la taxonomie type_de_contact ayant au moins un contact
 * (hide_empty), avec leur nombre de contacts.
 */
function annuaire_maritime_types() {
	$termes = get_terms( array(
		'taxonomy'   => AM_TAXONOMIE_TYPE,
		'hide_empty' => true,
		'orderby'    => 'name',
		'order'      => 'ASC',
	) );

	if ( is_wp_error( $termes ) ) {
		return rest_ensure_response( array() );
	}

	$types = array();
	foreach ( $termes as $terme ) {
		$types[] = array(
			'slug'  => $terme->slug,
			'label' => $terme->name,
			'count' => (int) $terme->count,
		);
	}

	return rest_ensure_response( $types );
}

/** Tous les contacts liés à un terme de la taxonomie. */
function annuaire_maritime_par_type( WP_REST_Request $request ) {
	$slug = $request->get_param( 'type' );

	$query = new WP_Query( array(
		'post_type'      => 'annuaire_maritime',
		'post_status'    => 'publish',
		'posts_per_page' => -1, // tous les contacts du type
		'orderby'        => 'title',
		'order'          => 'ASC',
		'tax_query'      => array(
			array(
				'taxonomy' => AM_TAXONOMIE_TYPE,
				'field'    => 'slug',
				'terms'    => $slug,
			),
		),
	) );

	return rest_ensure_response( am_formater_contacts( $query->posts ) );
}

/* -------------------------------------------------------------------------
 * 2. SHORTCODE : [annuaire_recherche]
 * ---------------------------------------------------------------------- */

add_shortcode( 'annuaire_recherche', function () {
	ob_start();
	?>
	<div class="am-recherche">

		<!-- Recherche par nom / prénom -->
		<div class="am-bloc">
			<input
				type="search"
				id="am-recherche-input"
				placeholder="Rechercher un contact par nom ou prénom…"
				autocomplete="off"
			/>
		</div>

		<!-- Filtre par pays -->
		<div class="am-bloc">
			<button type="button" id="am-pays-bouton" class="am-filtre-bouton" aria-haspopup="listbox" aria-expanded="false">
				Filtrer par pays…
			</button>
			<ul id="am-pays-liste" class="am-overlay" role="listbox" hidden></ul>
		</div>

		<!-- Filtre par type de contact -->
		<div class="am-bloc">
			<button type="button" id="am-type-bouton" class="am-filtre-bouton" aria-haspopup="listbox" aria-expanded="false">
				Filtrer par type de contact…
			</button>
			<ul id="am-type-liste" class="am-overlay" role="listbox" hidden></ul>
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

/* -------------------------------------------------------------------------
 * 3. SCRIPT + STYLES (chargés seulement si le shortcode est présent)
 * ---------------------------------------------------------------------- */

add_action( 'wp_footer', function () {
	global $post;
	if ( ! $post || ! has_shortcode( $post->post_content, 'annuaire_recherche' ) ) {
		return;
	}
	?>
	<style>
		.am-recherche {
			display: grid; grid-template-columns: repeat(3, 1fr);
			gap: 1.25em; align-items: start; font-size: 1rem;
			text-align: left;
		}
		@media (max-width: 760px) {
			.am-recherche { grid-template-columns: 1fr; }
		}
		.am-recherche .am-bloc { position: relative; }
		.am-recherche input,
		.am-recherche .am-filtre-bouton {
			width: 100%; padding: .6em .8em; box-sizing: border-box;
			font: inherit; font-size: 1rem; text-align: left;
		}
		.am-recherche input {
			border-radius: 1rem;
			padding-right: 2.6em; /* réserve la place de la loupe */
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cline x1='16.5' y1='16.5' x2='21' y2='21'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-position: right .8em center;
			background-size: 1.1em;
		}
		/* Masque la croix native des champs type=search (chevaucherait la loupe) */
		.am-recherche input::-webkit-search-cancel-button { -webkit-appearance: none; appearance: none; }

		.am-recherche .am-filtre-bouton {
			background: #fff; border: 1px solid #767676; border-radius: 3px;
			cursor: pointer; color: inherit;
		}
		.am-recherche .am-filtre-bouton::after { content: " ▾"; float: right; color: #666; }

		.am-recherche .am-overlay {
			list-style: none; margin: .25em 0 0; padding: 0;
			border: 1px solid #ccc; border-radius: 4px;
			background: #fff; position: absolute; width: 100%; z-index: 100;
			max-height: 420px; overflow-y: auto;
		}
		.am-recherche .am-overlay li { border-bottom: 1px solid #eee; }
		.am-recherche .am-overlay li:last-child { border-bottom: none; }

		/* Zone de résultats : pleine largeur sous les trois colonnes, ferrée à gauche */
		.am-recherche .am-resultats-zone {
			grid-column: 1 / -1;
			text-align: left;
			justify-self: start;
			width: 100%;
			max-width: 640px;
		}
		#am-resultats {
			list-style: none; margin: .5em 0 0; padding: 0;
			border: 1px solid #eee; border-radius: 4px;
		}
		#am-resultats li { border-bottom: 1px solid #eee; }
		#am-resultats li:last-child { border-bottom: none; }

		.am-recherche .am-overlay a,
		#am-resultats a,
		.am-recherche .am-option {
			display: block; padding: .55em .8em; text-decoration: none;
			color: inherit; cursor: pointer; text-align: left;
		}
		.am-recherche .am-overlay a:hover,
		.am-recherche .am-overlay a:focus,
		#am-resultats a:hover,
		#am-resultats a:focus,
		.am-recherche .am-option:hover,
		.am-recherche .am-option:focus { background: #f2f6fb; }

		.am-recherche .am-detail { font-size: .85em; color: #666; }
		.am-recherche .am-compte { font-size: .85em; color: #888; }
		.am-recherche .am-option-reset { color: #888; font-size: .9em; }
		.am-recherche .am-flag {
			height: 14px; width: auto; margin-right: .5em;
			vertical-align: baseline; border: 1px solid rgba(0,0,0,.1);
			border-radius: 2px;
		}
		#am-message { font-size: .9em; color: #666; margin: .5em 0 0; }
	</style>
	<script>
	(function () {
		var endpointRecherche = '<?php echo esc_url_raw( rest_url( 'annuaire/v1/recherche' ) ); ?>';
		var endpointPays      = '<?php echo esc_url_raw( rest_url( 'annuaire/v1/pays' ) ); ?>';
		var endpointParPays   = '<?php echo esc_url_raw( rest_url( 'annuaire/v1/par-pays' ) ); ?>';
		var endpointTypes     = '<?php echo esc_url_raw( rest_url( 'annuaire/v1/types' ) ); ?>';
		var endpointParType   = '<?php echo esc_url_raw( rest_url( 'annuaire/v1/par-type' ) ); ?>';

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

		/* ---- Fabrique une ligne de contact (drapeau + nom + téléphone) ---- */
		function creerLigneContact(c) {
			var li = document.createElement('li');
			var a  = document.createElement('a');
			a.href = c.lien;

			// Drapeau(x) avant le nom
			if (Array.isArray(c.pays)) {
				c.pays.forEach(function (p) {
					a.appendChild(creerDrapeau(p));
				});
			}

			var titre = document.createElement('strong');
			titre.textContent = (c.prenom + ' ' + c.nom).trim();
			a.appendChild(titre);

			if (c.telephone) {
				var detail = document.createElement('span');
				detail.className = 'am-detail';
				detail.textContent = c.telephone;
				a.appendChild(document.createElement('br'));
				a.appendChild(detail);
			}

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
	</script>
	<?php
} );
