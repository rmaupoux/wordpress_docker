# Annuaire Unifié - Bateaux & Maritime

Plugin WordPress qui regroupe les fonctionnalités de recherche et d'annuaire pour bateaux (YACHT), contacts maritimes (CHARTER) et réseau (NETWORK).

## Structure du Plugin

```
annuaire-unifiee/
├── annuaire-unifiee.php          # Fichier principal du plugin
├── css/
│   └── style.css                 # Feuille de styles unifiée
├── js/
│   ├── script.js                 # Formulaire de recherche principal ([annuaire_tabs] / [annuaire_bateaux_recherche] / [annuaire_recherche])
│   ├── equipements.js             # Filtre unifié ([annuaire_bateaux_filtres_equipements])
│   └── currency.js               # Sélecteur de devise + conversion des prix (toutes pages avec cartes bateau)
├── includes/
│   ├── class-plugin.php          # Classe principale (init, enqueue CSS/JS conditionnel, localize)
│   ├── helpers.php               # Constantes partagées (CPT, taxonomies, whitelists de champs pour les filtres)
│   ├── currency.php               # Taux de change EUR -> USD/GBP/CHF/AED (transient 24h, API frankfurter.app)
│   ├── cf7-dynamic-recipient.php # Destinataire dynamique + champs cachés des formulaires Contact Form 7
│   ├── pods-template-helpers.php # Helpers de magic tag Pods utilisés dans les templates FSE (fiches, archives)
│   ├── shortcodes/               # Shortcodes
│   │   ├── tabs.php              # Shortcode [annuaire_tabs]
│   │   ├── bateaux.php           # Shortcodes [annuaire_bateaux_recherche] et [annuaire_bateaux_par_type]
│   │   ├── bateaux-equipements.php # Shortcode [annuaire_bateaux_filtres_equipements]
│   │   └── maritime.php          # Shortcode [annuaire_recherche]
│   └── endpoints/                # Endpoints REST
│       ├── bateaux.php           # Endpoints pour bateaux
│       └── maritime.php          # Endpoints pour maritime
└── README.md                     # Cette documentation
```

## Shortcodes Disponibles

### `[annuaire_tabs]`
Affiche le système d'onglets complet avec trois tabs :
- **YACHT** : Recherche et listing des bateaux
- **CHARTER** : Recherche des contacts maritimes
- **NETWORK** : Contenu réservé (en attente)

### `[annuaire_bateaux_recherche]`
Affiche uniquement la recherche de bateaux avec :
- Recherche instantanée par modèle
- Filtres : type de bateau, longueur (+unité FT/M), année, prix (+devise)
- Carrousel "Featured Yachts"
- Tri des résultats
- Pagination

### `[annuaire_bateaux_par_type]`
Grille des bateaux du type consulté (mêmes cartes/markup que `[annuaire_bateaux_recherche]`),
destinée au template FSE d'archive de la taxonomie `type_de_bateau`
(ex : `/type-de-bateau/motor-yacht/`). Rendu 100 % PHP, sans formulaire de
recherche ; se base sur `get_queried_object()` et affiche la pagination WordPress
native (`paginate_links`).

### `[annuaire_bateaux_filtres_equipements]`
**Filtre unifié de bateaux** (ajouté avec la « Page de filtres dédiée V1 »),
vocation à terme à remplacer le formulaire de recherche de
`[annuaire_bateaux_recherche]`. Colonne de filtres à gauche, résultats
instantanés sous forme de cartes à droite (réutilise `#ab-message` /
`#ab-results-grid` / `#ab-pagination`, gérés par `js/currency.js`). Groupes de
filtres disponibles :
- **Plus de champs** : Model, Type, Country, Length, Year, Price, champs texte
  (Town, Builder, Draft), champs numériques (Cabins, Gross tonnage, Capacity,
  Bed, Shower room, Crew), et 2 checkboxes (Featured, VAT Paid)
- **Technical equipements**, **Nautical instruments**, **Kitchen**, **Boat
  Accessories** : groupes de champs booléens Pods affichés en checkboxes
  (cumulées en ET), voir `AB_GROUPES_EQUIPEMENTS` dans `includes/helpers.php`
- **Engine** : champs texte (Make, Model, Year, Total power, Fuel Type) et
  champ numérique en plage (Engine hours)

Tous les filtres se cumulent en ET côté REST (`ab_filtrer_bateaux`). Les champs
texte et le champ Model bénéficient d'une autocomplétion à partir de 3
caractères sur les valeurs déjà en base (endpoint `/valeurs-champ`).

### `[annuaire_recherche]`
Affiche uniquement la recherche de contacts maritimes avec :
- Recherche par nom/prénom
- Filtres : pays, type de contact
- Affichage avec drapeaux des pays

## Endpoints REST API

### Bateaux (`annuaire-bateau/v1`)
- `GET /recherche?terme=xxx` - Recherche de contacts (3+ caractères)
- `GET /recherche-modeles?terme=xxx` - Recherche de bateaux par modèle (3+ caractères)
- `GET /par-contact?contact_id=xxx` - Bateaux d'un contact
- `GET /a-la-une` - Bateaux marqués « à la une »
- `GET /types` - Liste des types de bateaux (taxonomie `type_de_bateau`)
- `GET /pays` - Codes pays distincts présents parmi les bateaux
- `GET /valeurs-champ?champ=xxx&terme=yyy` - Autocomplétion (3+ caractères) sur les valeurs existantes d'un champ (whitelist `AB_CHAMPS_AUTOCOMPLETE`)
- `GET /filtrer` - Bateaux avec filtres multi-critères et pagination : `contact`, `model`, `type`, `length_min/max`, `year_min/max`, `price_min/max`, `equipements[]`, `champs_texte[slug]`, `champs_numeriques[slug][min|max]`, `pays`, `page`
- `POST /link-boats-to-types` - Lie tous les bateaux à leur type de bateau (auto-détection par mots-clés)

### Maritime (`annuaire/v1`)
- `GET /recherche?terme=xxx` - Recherche de contacts
- `GET /pays` - Liste des pays
- `GET /par-pays?code=FR` - Contacts d'un pays
- `GET /types` - Types de contact
- `GET /par-type?type=slug` - Contacts d'un type

## Fichiers CSS

Le fichier `css/style.css` regroupe tous les styles pour :
- Système d'onglets
- Inputs et selects (styling cohérent)
- Icônes de loupe
- Cartes de bateaux
- Filtre unifié (`[annuaire_bateaux_filtres_equipements]`)
- Pagination
- Responsive design

## Sélecteur de devise

`includes/currency.php` récupère les taux de change EUR -> USD/GBP/CHF/AED
(source : `frankfurter.app`, taux de référence BCE, mis en cache 24h dans un
transient ; l'AED est dérivé du taux USD via sa parité fixe avec la Banque
centrale des Émirats). `js/currency.js` est chargé sur toutes les pages
affichant des cartes bateau (formulaire de recherche, filtre équipements,
fiche bateau, archive par type) et reformate les prix (`data-price-euros`) à
chaque mutation de `#ab-results-grid`, y compris pour le contenu rendu côté
PHP (fiche bateau, grille Pods Template).

## Formulaires de contact (Contact Form 7)

`includes/cf7-dynamic-recipient.php` :
- Fiche bateau : destinataire dynamique (email du contact associé, ou email
  admin à défaut) + champs cachés (`boat_model`, `boat_url`)
- Fiche annuaire maritime : destinataire fixe + champs cachés identifiant la
  fiche et la personne affichée
- En local (`SMTP_HOST` défini, environnement Docker sans accès internet
  sortant), désactive le reCAPTCHA du formulaire bateau (id 2120) pour éviter
  un marquage spam systématique

## Helpers de magic tag Pods

`includes/pods-template-helpers.php` fournit les helpers utilisés dans les
Pods Templates des fiches et archives (syntaxe `{@field,helper_name}`), entre
autres : accordéons d'équipements et specs moteur générés dynamiquement depuis
la structure Pods, carrousel « Featured Yachts » et grille de bateaux d'un
contact (mêmes markup/classes que les cartes JS), rendu du shortcode
`[annuaire_bateaux_par_type]` sur l'archive de taxonomie, et un correctif du
bloc « Pods Single Item » sur cette même archive (contexte postType/postId
erroné fourni par WordPress sur les archives de taxonomie).

## Requêtes GraphQL (optionnel)

Les données peuvent également être récupérées via GraphQL pour :
- CPT `annuaire_bateau`
- Taxonomie `type_de_bateau`
- CPT `annuaire_maritime`
- Taxonomie `type_de_contact`

## Installation

1. Copier le dossier `annuaire-unifiee` dans `/wp-content/plugins/`
2. Activer le plugin dans WordPress

## JavaScript et REST API

Les assets sont chargés de façon conditionnelle selon la page (voir
`enqueue_assets()` dans `includes/class-plugin.php`) :
- `js/currency.js` : dès qu'une page affiche des cartes bateau (formulaire de
  recherche, filtre équipements, fiche bateau, archive par type)
- `js/script.js` : uniquement sur les pages utilisant `[annuaire_tabs]`,
  `[annuaire_bateaux_recherche]`, `[annuaire_recherche]`, ou une fiche
  singulière (`annuaire_bateau` / `annuaire_maritime`)
- `js/equipements.js` : uniquement sur les pages utilisant
  `[annuaire_bateaux_filtres_equipements]` (remplace `script.js`, qui suppose
  la présence du formulaire de recherche principal)

Les URLs des endpoints REST sont transmises au JavaScript via
`wp_localize_script()`, dans des objets globaux distincts (un même nom de
variable serait écrasé par le second appel) :

```js
// pour js/script.js
AnnuaireUnifieeVars.bateaux.recherche
AnnuaireUnifieeVars.bateaux.rechercheModeles
AnnuaireUnifieeVars.bateaux.types
AnnuaireUnifieeVars.bateaux.filtrer
AnnuaireUnifieeVars.bateaux.alaUne
AnnuaireUnifieeVars.maritime.recherche
AnnuaireUnifieeVars.maritime.pays
AnnuaireUnifieeVars.maritime.parPays
AnnuaireUnifieeVars.maritime.types
AnnuaireUnifieeVars.maritime.parType

// pour js/currency.js
AnnuaireUnifieeDevises.base
AnnuaireUnifieeDevises.taux

// pour js/equipements.js
AnnuaireUnifieeEquipementsVars.filtrer
AnnuaireUnifieeEquipementsVars.types
AnnuaireUnifieeEquipementsVars.pays
AnnuaireUnifieeEquipementsVars.valeursChamp
```

## Notes

Ce plugin remplace et fusionne les deux anciens plugins `annuaire-bateaux-recherche`
et `annuaire-maritime-recherche` (désormais supprimés). Tout leur code PHP, CSS et
JS a été repris à l'identique et réparti dans la structure ci-dessus.
