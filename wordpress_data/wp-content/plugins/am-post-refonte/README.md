# AM Post Refonte

Plugin WordPress dédié à la refonte de l'affichage des articles (catégorie
"Activities" et ses sous-catégories, ex : "World luxury events").

Extrait du plugin `annuaire-unifiee` (qui n'a rien à voir avec les articles)
pour isoler ce périmètre.

## Structure du Plugin

```
am-post-refonte/
├── am-post-refonte.php           # Fichier principal du plugin
├── css/
│   └── style.css                  # Styles des classes .am-activities-*
├── includes/
│   ├── class-plugin.php          # Classe principale (init, enqueue CSS conditionnel)
│   └── shortcodes/
│       └── activities.php        # Shortcodes [am_breadcrumb], [am_eyebrow], [am_back_link], [am_result_count]
└── README.md                      # Cette documentation
```

## Shortcodes Disponibles

Utilisés dans le template FSE `category-{slug}.html` du thème
(ex : `templates/category-world-luxury-events.html`) :

- `[am_breadcrumb]` - Fil d'Ariane ("Accueil · Activities · World luxury events")
- `[am_eyebrow]` - Nom de la catégorie racine (ex: "ACTIVITIES")
- `[am_back_link label="Back to all articles"]` - Lien vers la catégorie parente
- `[am_result_count label="Articles"]` - "Articles - 30 Results"

## Chargement du CSS

`css/style.css` (classes `.am-activities-*`) est chargé uniquement sur :
- l'archive de la catégorie `activities`,
- l'archive de n'importe quelle catégorie ayant `activities` comme ancêtre,
- l'archive de toute catégorie disposant de son propre template FSE
  `category-{slug}.html` dans le thème actif (détection indépendante de la
  hiérarchie des catégories, pour rester fonctionnelle même si une catégorie
  comme "World luxury events" est déplacée hors de "Activities").

Voir `page_est_archive_activities()` dans `includes/class-plugin.php`.

## Installation

1. Copier le dossier `am-post-refonte` dans `/wp-content/plugins/`
2. Activer le plugin dans WordPress
