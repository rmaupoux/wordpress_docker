#!/bin/bash

# Attendre que WordPress soit prêt
sleep 10

# Vérifier si l'utilisateur admin existe déjà
if ! wp user get admin --allow-root 2>/dev/null; then
  echo "Création de l'utilisateur administrateur..."
  wp user create admin admin@example.com --user_pass=admin --role=administrator --allow-root
  echo "Utilisateur administrateur créé avec succès"
else
  echo "L'utilisateur administrateur existe déjà"
fi
