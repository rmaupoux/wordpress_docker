# Annuaire Unifié - Bateaux & Maritime

Plugin WordPress qui regroupe les fonctionnalités de recherche et d'annuaire pour bateaux (YACHT), contacts maritimes (CHARTER) et réseau (NETWORK).

## Structure du Plugin

```
annuaire-unifiee/
├── annuaire-unifiee.php          # Fichier principal du plugin
├── css/
│   └── style.css                 # Feuille de styles unifiée
├── js/
│   └── script.js                 # Fichiers JavaScript
├── includes/
│   ├── class-plugin.php          # Classe principale (init, enqueue CSS/JS, localize)
│   ├── helpers.php               # Constantes partagées (CPT, taxonomies)
│   ├── shortcodes/               # Shortcodes
│   │   ├── tabs.php              # Shortcode [annuaire_tabs]
│   │   ├── bateaux.php           # Shortcode [annuaire_bateaux_recherche]
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
- Recherche instantanée par contact
- Filtres : type de bateau, longueur, année, prix
- Tri des résultats
- Pagination

### `[annuaire_recherche]`
Affiche uniquement la recherche de contacts maritimes avec :
- Recherche par nom/prénom
- Filtres : pays, type de contact
- Affichage avec drapeaux des pays

## Endpoints REST API

### Bateaux
- `GET /wp-json/annuaire-bateau/v1/recherche?terme=xxx` - Recherche de contacts
- `GET /wp-json/annuaire-bateau/v1/types` - Liste des types de bateaux
- `GET /wp-json/annuaire-bateau/v1/filtrer` - Bateaux avec filtres et pagination
- `GET /wp-json/annuaire-bateau/v1/par-contact?contact_id=xxx` - Bateaux d'un contact

### Maritime
- `GET /wp-json/annuaire/v1/recherche?terme=xxx` - Recherche de contacts
- `GET /wp-json/annuaire/v1/pays` - Liste des pays
- `GET /wp-json/annuaire/v1/par-pays?code=FR` - Contacts d'un pays
- `GET /wp-json/annuaire/v1/types` - Types de contact
- `GET /wp-json/annuaire/v1/par-type?type=slug` - Contacts d'un type

## Fichiers CSS

Le fichier `css/style.css` regroupe tous les styles pour :
- Système d'onglets
- Inputs et selects (styling cohérent)
- Icônes de loupe
- Cartes de bateaux
- Pagination
- Responsive design

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

Les URLs des endpoints REST sont transmises au JavaScript via `wp_localize_script()`
dans un objet global `AnnuaireUnifieeVars` (voir `includes/class-plugin.php`) :

```js
AnnuaireUnifieeVars.bateaux.recherche
AnnuaireUnifieeVars.bateaux.types
AnnuaireUnifieeVars.bateaux.filtrer
AnnuaireUnifieeVars.maritime.recherche
AnnuaireUnifieeVars.maritime.pays
AnnuaireUnifieeVars.maritime.parPays
AnnuaireUnifieeVars.maritime.types
AnnuaireUnifieeVars.maritime.parType
```

## Notes

Ce plugin remplace et fusionne les deux anciens plugins `annuaire-bateaux-recherche`
et `annuaire-maritime-recherche` (désormais supprimés). Tout leur code PHP, CSS et
JS a été repris à l'identique et réparti dans la structure ci-dessus.
