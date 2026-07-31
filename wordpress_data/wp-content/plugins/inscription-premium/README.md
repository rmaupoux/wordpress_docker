# Inscription Premium

Plugin WordPress : inscription/connexion front-end, abonnement, et tunnel de
dépôt d'annonce en 5 étapes, adossé au CPT Pods `annuaire_bateau`.

## 1. Prérequis

- WordPress avec le plugin **Pods Framework** actif.
- Le CPT Pods `annuaire_bateau` (label "Annuaire bateaux") doit exister, avec
  au minimum les champs suivants déjà créés côté Pods :
  `model`, `pays` (pick_object `country`), `town`, `year`, `builder`,
  `lenght_ft`, `cabins`, `asking_price`, `vat`, `photo_galerie` (galerie
  multi-fichiers), `contact_assoc` (relation vers le CPT `annuaire_maritime`),
  et les champs moteur `make`, `fuel_type`, `engine_hours_`.
- Le CPT Pods `annuaire_maritime` (fiche contact/vendeur) avec les champs
  `prenom`, `nom`, `email`, `telephone`.
- La taxonomie `type_de_bateau` associée au CPT `annuaire_bateau` : l'étape 1
  du tunnel génère ses cartes dynamiquement depuis les termes existants (pas
  de liste figée dans le code).

À l'activation, le plugin **complète** automatiquement le pod
`annuaire_bateau` avec les champs manquants nécessaires au formulaire de
l'étape 2 (voir `includes/class-activator.php`), sans toucher aux champs déjà
créés :

- `draft` (tirant d'eau)
- `gross_tonnage` (tonnage)
- `capacity` (nombre de personnes à bord)
- `bed` (couchages)
- `shower_room` (salles d'eau)
- `ip_listing_expiry` (date d'expiration de l'annonce, calculée à la
  publication à partir de la durée choisie à l'étape 4)

Si les noms de champs Pods sont différents sur votre site, éditez simplement
`includes/field-mapping.php` (aucune autre partie du code n'a besoin d'être
modifiée) ou utilisez les filtres `inscription_premium_boat_field_map`,
`inscription_premium_contact_field_map`, `inscription_premium_boat_photos_field`
et `inscription_premium_boat_contact_field`.

## 2. Installation

1. Copier le dossier `inscription-premium` dans `wp-content/plugins/`.
2. Activer le plugin depuis **Extensions**.
3. Créer deux pages WordPress :
   - une page contenant le shortcode `[inscription_premium_auth]` ;
   - une page contenant le shortcode `[inscription_premium_tunnel]`.
   Optionnellement, une page avec `[inscription_premium_plans]` pour
   présenter les offres d'abonnement.
4. Aller dans **Inscription Premium → Réglages** et sélectionner ces deux
   pages dans les champs "Page contenant [...]" (utilisées pour les
   redirections après connexion et pour le bouton "Return" du tunnel).

## 3. Configuration Stripe

1. Dans **Inscription Premium → Réglages**, renseigner la **clé publique**
   et la **clé secrète** Stripe (mode test ou live selon l'environnement).
2. Dans le dashboard Stripe, créer un endpoint webhook pointant vers l'URL
   affichée dans les réglages :
   `https://votre-site.com/wp-json/inscription-premium/v1/stripe-webhook`
   Écouter l'évènement `checkout.session.completed`.
3. Copier le **secret de signature** du webhook dans le champ "Secret
   webhook" des réglages.
4. Configurer les tarifs des offres 30/60/90 jours, la durée mise en avant
   "Recommandé", le supplément de l'option Highlights, et les tarifs des
   offres d'abonnement (mensuel/annuel).

L'annonce n'est publiée (statut `publish`) qu'après confirmation du
paiement par le webhook Stripe côté serveur — jamais sur un simple retour de
navigateur.

## 4. Shortcodes

| Shortcode | Usage |
|---|---|
| `[inscription_premium_auth]` | Formulaire connexion / inscription / mot de passe oublié |
| `[inscription_premium_tunnel]` | Tunnel de dépôt d'annonce en 5 étapes |
| `[inscription_premium_plans]` | Présentation des offres d'abonnement |

## 5. Comportement d'accès

Par défaut, l'accès au tunnel exige un compte connecté **et** un abonnement
actif (`ip_subscription_status = active`). Ce comportement est filtrable :

```php
add_filter( 'inscription_premium_requires_subscription', '__return_false' );
```

Passer ce filtre à `false` retire l'exigence d'abonnement (modèle
"paiement à l'annonce", géré uniquement à l'étape 5).

## 6. Tableau de bord Abonnés

**Inscription Premium → Abonnés** liste les utilisateurs avec leur statut
d'abonnement (actif / expire bientôt / expiré / suspendu), permet de filtrer,
rechercher, trier, appliquer des actions groupées (prolonger, suspendre,
réactiver, envoyer un rappel), et d'exporter la liste filtrée en CSV. Le
bouton "Modifier" ouvre une fiche dédiée avec l'historique des
paiements/renouvellements (table `wp_ip_subscription_history`, créée à
l'activation).

La capacité requise est `manage_ip_subscriptions` (attribuée au rôle
Administrateur à l'activation).

## 7. Hooks utiles

- `inscription_premium_user_registered( $user_id, $email )`
- `inscription_premium_subscription_updated( $user_id )`
- `inscription_premium_subscription_expired( $user_id )`
- `inscription_premium_listing_published( $post_id, $user_id )`
- `inscription_premium_requires_subscription` (filtre bool)
- `inscription_premium_payment_gateway` (filtre : remplacer `IP_Stripe_Gateway`
  par une autre implémentation de l'interface `IP_Payment_Gateway`)

## 8. Limites connues / à prévoir avant mise en production

- La vérification d'email à l'inscription n'est pas activée par défaut
  (branchable via `inscription_premium_user_registered`).
- Le champ "Localisation" utilise une liste de pays courte orientée marché
  nautique (`includes/helpers.php::ip_get_country_list()`), filtrable via
  `inscription_premium_country_list`.
