# AM Post Refonte

Plugin WordPress dédié à la refonte de l'affichage des articles (catégorie
"Activities" et ses sous-catégories, ex : "World luxury events", ainsi que le
template "Blog Home").

Extrait du plugin `annuaire-unifiee` (qui n'a rien à voir avec les articles)
pour isoler ce périmètre.

## Structure du Plugin

```
am-post-refonte/
├── am-post-refonte.php           # Fichier principal du plugin
├── css/
│   ├── style.css                  # Styles des classes .am-activities-* (archives + cartes)
│   └── home.css                   # Styles du slider et des blocs par catégorie du "Blog Home"
├── js/
│   ├── view-toggle.js             # Toggle grille/liste (archives Activities)
│   └── home-slider.js             # Navigation du slider "à la une" (Blog Home)
├── includes/
│   ├── class-plugin.php          # Classe principale (init, enqueue CSS/JS conditionnel)
│   └── shortcodes/
│       ├── activities.php        # Shortcodes [am_breadcrumb], [am_eyebrow], [am_back_link], [am_result_count]
│       └── home.php              # Shortcodes [am_home_slider], [am_home_categories]
└── README.md                      # Cette documentation
```

## Shortcodes Disponibles

Utilisés dans `templates/archive.html` (toutes les archives de catégorie) et
`templates/single.html` (tous les articles) du thème actif :

- `[am_breadcrumb]` - Fil d'Ariane ("Accueil · Activities · World luxury events").
  Sur un article, se base sur sa catégorie principale (Yoast) ou, à défaut,
  sa première catégorie (voir `am_post_refonte_terme_courant()`).
- `[am_eyebrow]` - Nom de la catégorie racine (ex: "ACTIVITIES")
- `[am_back_link label="Back to all articles" arrow="left|right|none" class="..."]` -
  Lien vers la catégorie parente. Réutilisé tel quel pour le bouton
  "View all articles →" en bas des articles (`arrow="right"`).
- `[am_result_count label="Articles"]` - "Articles - 30 Results"

Utilisés dans le template FSE `home.html` du thème ("Blog Home") :

- `[am_home_slider count="5"]` - Slider des derniers articles épinglés
  (sticky ; à défaut les derniers publiés), avec vignette, badge "Highlight",
  titre, date, extrait, étiquettes et lien "Read the article".
- `[am_home_categories per_page="3" exclude="non-classe,uncategorized"]` -
  Une section par catégorie ayant des articles (triées par nombre
  d'articles décroissant), avec une grille des plus récents et un lien
  "View all" vers l'archive de la catégorie.

## Chargement du CSS/JS

`css/style.css` (classes `.am-activities-*` et `.am-post-*`) est chargé sur :
- toute archive de catégorie (`is_category()`, gabarit `templates/archive.html`),
- tout article (`is_singular( 'post' )`, gabarit `templates/single.html`),
- la page d'accueil du blog (`is_home()`), car les cartes de
  `[am_home_categories]` réutilisent les classes `.am-activities-card`.

`css/home.css` et `js/home-slider.js` sont chargés uniquement sur la page
d'accueil du blog (`is_home()`).

Voir `page_est_archive_activities()` et `enqueue_assets()` dans
`includes/class-plugin.php`.

## Installation

1. Copier le dossier `am-post-refonte` dans `/wp-content/plugins/`
2. Activer le plugin dans WordPress
