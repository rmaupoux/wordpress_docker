# Checklist de tests manuels — Inscription Premium

## Activation

- [ ] Le plugin s'active sans erreur fatale (avec Pods actif).
- [ ] Sans Pods actif, un message d'admin clair s'affiche et rien ne casse.
- [ ] La table `wp_ip_subscription_history` est créée.
- [ ] Les champs Pods manquants (`draft`, `gross_tonnage`, `capacity`, `bed`,
      `shower_room`, `ip_listing_expiry`) apparaissent dans l'admin Pods du
      pod `annuaire_bateau`, groupe "Plus de champs", sans dupliquer les
      champs déjà existants en le réactivant deux fois.
- [ ] Le rôle Administrateur a la capacité `manage_ip_subscriptions`.

## Authentification `[inscription_premium_auth]`

- [ ] Inscription avec email déjà utilisé → message d'erreur, pas de doublon.
- [ ] Inscription avec mot de passe < 8 caractères → rejetée.
- [ ] Inscription valide → compte créé, connecté automatiquement, redirigé
      vers `redirect_to` si présent en query arg.
- [ ] Connexion avec identifiants invalides → message d'erreur.
- [ ] Connexion valide → session ouverte, redirection correcte.
- [ ] Mot de passe oublié : même message affiché que l'email existe ou non ;
      email de réinitialisation reçu (vérifier Mailpit sur `:8025`).
- [ ] Déconnexion fonctionne et revient sur la page.

## Abonnement `[inscription_premium_plans]`

- [ ] Utilisateur non connecté voit un CTA "Se connecter" au lieu du bouton
      de souscription.
- [ ] Offre gratuite (prix = 0) : souscription immédiate, statut passe à
      `active`, historique loggé.
- [ ] Offre payante : le bouton indique que le paiement doit passer par
      Stripe (pas de souscription directe côté offre payante autonome).
- [ ] Le cron quotidien (`inscription_premium_check_expirations`) repasse un
      abonnement `active` dont la date d'expiration est dépassée en
      `expired` (déclencher manuellement via WP-CLI `wp cron event run
      inscription_premium_check_expirations` pour tester sans attendre).

## Tunnel — accès

- [ ] Utilisateur non connecté → message + lien de connexion, pas d'accès
      direct aux étapes via URL `?ip_step=3`.
- [ ] Utilisateur connecté sans abonnement actif (si
      `inscription_premium_requires_subscription` = true) → message +
      renvoi vers les offres.
- [ ] Impossible d'accéder à une étape au-delà de la progression réelle en
      modifiant l'URL (`?ip_step=5` sans avoir rempli les étapes
      précédentes redirige vers l'étape max autorisée).

## Étape 1 — Type

- [ ] Les cartes correspondent aux termes réels de la taxonomie
      `type_de_bateau` (ajouter un terme dans Pods → il apparaît sans
      modification de code).
- [ ] Le bouton "Continue" reste désactivé tant qu'aucun type n'est choisi.
- [ ] Le choix est conservé si on revient en arrière puis en avant.

## Étape 2 — Specifications

- [ ] Les 5 sections (Général, Motorisation, Layout, Contact, Price)
      s'affichent avec les bons libellés.
- [ ] Soumission avec un champ requis vide (ex : Model) → erreur serveur
      claire, pas de passage à l'étape 3.
- [ ] Email de contact invalide → rejeté côté serveur même si le champ HTML
      `type="email"` est contourné.
- [ ] Données valides → sauvegardées dans le draft (`ip_draft_{user_id}`),
      redirection vers l'étape 3.
- [ ] Recharger la page à l'étape 2 après un aller-retour : les valeurs
      précédemment saisies sont pré-remplies.

## Étape 3 — Pictures

- [ ] Upload d'un fichier non-image (ex: `.pdf`) → rejeté.
- [ ] Upload d'une image > taille max configurée → rejeté.
- [ ] Drag & drop d'images fonctionne au même titre que le clic + parcourir.
- [ ] Avec moins de 3 photos, le bouton "Continue" reste désactivé et un
      message d'erreur apparaît si on force l'appel.
- [ ] Suppression d'une photo la retire du draft ET de la médiathèque (si
      elle appartient à l'utilisateur courant).
- [ ] À la validation (≥ 3 photos), un post `annuaire_bateau` en statut
      `draft` est créé, avec les champs de l'étape 2 correctement mappés
      (vérifier dans l'admin Pods), la galerie photo remplie, et une fiche
      `annuaire_maritime` créée/réutilisée pour le contact
      (`ip_contact_id` en user meta).

## Étape 4 — Period of validity

- [ ] Le récapitulatif affiche la bonne photo de couverture, le bon titre,
      prix et localisation.
- [ ] Les tarifs 30/60/90 jours affichés correspondent aux réglages admin.
- [ ] Le badge "Recommandé" est sur la durée configurée en admin.
- [ ] Cocher "Highlights" modifie le total attendu à l'étape 5.
- [ ] Sélection sans durée choisie → erreur bloquante.

## Étape 5 — Payment

- [ ] Sans clé Stripe configurée → message explicite, pas de bouton de
      paiement actif.
- [ ] Avec clés de test Stripe configurées : le bouton "Payer" ouvre bien
      une session Stripe Checkout avec le bon montant (durée + option).
- [ ] Paiement test réussi → webhook reçu, signature vérifiée, annonce
      passée en `publish`, date d'expiration Pods renseignée, draft vidé,
      entrée ajoutée dans l'historique de l'abonné.
- [ ] Rejeu du même évènement webhook (idempotence basique) ne casse rien
      de critique (à surveiller, pas de garde d'idempotence stricte dans
      cette v1 — voir README).
- [ ] Annulation côté Stripe Checkout renvoie sur l'étape 5 sans publier
      l'annonce.

## Admin — Réglages

- [ ] Enregistrement des réglages (Stripe, durées, tarifs) persiste après
      rechargement.
- [ ] Les pages sélectionnées pour auth/tunnel sont bien utilisées pour les
      redirections (`IP_Auth::get_login_url`, `IP_Tunnel::get_tunnel_page_url`).
- [ ] La page "Annonces en brouillon" liste bien les brouillons créés par
      le tunnel (et seulement ceux-ci).

## Admin — Abonnés

- [ ] La liste se charge avec pagination (20/page), tri par date
      d'inscription et par date d'expiration.
- [ ] Recherche par nom/email fonctionne.
- [ ] Filtres par statut (Actif / Expire bientôt / Expiré / Suspendu) et par
      offre filtrent correctement.
- [ ] Action rapide "Prolonger" (ligne) ajoute bien des jours à la date
      d'expiration existante (ou à partir d'aujourd'hui si déjà expirée).
- [ ] Action rapide "Suspendre" / "Annuler" change le statut et journalise
      dans l'historique.
- [ ] Actions groupées (sélection multiple + "Appliquer") fonctionnent sur
      plusieurs utilisateurs à la fois, avec vérification de nonce.
- [ ] "Envoyer un email de rappel" envoie effectivement un email (vérifier
      Mailpit).
- [ ] La fiche "Modifier" permet de changer statut/expiration/offre/note, et
      l'historique se met à jour immédiatement après enregistrement.
- [ ] L'export CSV respecte les filtres actifs (statut/offre/recherche) et
      contient les bonnes colonnes.
- [ ] Un utilisateur sans la capacité `manage_ip_subscriptions` ne peut pas
      accéder aux pages ni déclencher les actions (tester avec un rôle
      Abonné, y compris en appelant les URLs d'action directement).

## Sécurité

- [ ] Toutes les actions d'écriture (front + admin) échouent proprement si
      le nonce est absent/invalide.
- [ ] Impossible pour un utilisateur A de modifier/finaliser le draft ou
      l'annonce d'un utilisateur B (tester en changeant l'ID dans les
      appels REST).
- [ ] Le endpoint webhook Stripe refuse toute requête sans signature valide.
