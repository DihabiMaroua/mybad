# Badminton Booking System RESTful web API avec Node.js, Express.js, MySQL
## Projet 2: Système de réservation de terrains de badminton
Une association de badistes souhaite créer un site web mybad.fr permettant de réserver des terrains de badminton pour ses adhérents. La municipalité a mis à disposition de l’association une salle de 4 terrains (A, B, C et D). La salle est ouverte du lundi au samedi de 10h à 22h.

Il est possible de réserver des créneaux de 45 minutes. Pour effectuer une réservation, il faut être identifié par le système (par un simple pseudo). Par souci de simplification, il ne sera possible d’effectuer des réservations que sur la semaine en cours.

La toiture du stade souffre de quelques problèmes d’étanchéité. Lors de fortes pluies, le terrain B est souvent impraticable les deux jours suivants. En attendant que des travaux soient effectués, l’association aimerait pouvoir rendre un terrain au choix indisponible de manière temporaire. Un terrain indisponible ne peut accueillir de nouvelles réservations.

Bonus: Seul un administrateur du système peut rendre indisponible un terrain. Cette ressource doit donc être protégée par authentification. Pour cela, le système doit exposer une ressource pour authentifier l’administrateur identifié par le pseudo réservé admybad et le mot de passe admybad. Par souci de simplification, vous pouvez “coder en dur” cet utilisateur dans votre système.

## Table des Matières
- [Prérequis](#prérequis)
- [Lancer le projet](#Lancer-le-projet)
  - [Installation des Dépendances](#installation-des-dépendances)
  - [Configuration de l'Environnement](#configuration-de-lenvironnement)
  - [Création de la Base de Données](#création-de-la-base-de-données)
  - [Lancement du Serveur](#lancement-du-serveur)
  - [URL d'Entrée de l'API](#url-dentrée-de-lapi)
- [Conception](#Conception)
  - [Dictionnaire de Données](#dictionnaire-de-données)
  - [Routes de l'API](#routes-de-lapi)
  - [Entités de la Base de Données](#entités-de-la-base-de-données)
  - [Modèle Conceptuel de Données (MCD)](#modèle-conceptuel-de-données-mcd)
- [Remarques](#remarques)
- [Références](#références)

## Prérequis

- Node.js
- npm (Node Package Manager)
- MySQL installé localement

## Lancer le Projet

### Installation des dépendances

Exécutez la commande suivante dans votre terminal à la racine de votre projet pour installer les dépendances nécessaires :

```sh
npm install
```
Le projet utilise plusieurs paquets npm. Voici une liste des principales dépendances que vous devrez installer :

- **express** : Un framework web minimaliste et flexible pour Node.js. Il aide à gérer les routes, les requêtes, et la structure générale de l'application.
- **mysql** : Un pilote client pour interagir avec des bases de données MySQL. Il permet à l'application de communiquer avec votre base de données MySQL pour effectuer des requêtes et recevoir des données.
- **jsonwebtoken** : Implémentation des JSON Web Tokens pour sécuriser les routes. Ceci est crucial pour l'authentification et la sécurisation des communications entre le client et le serveur.
- **moment** : Une bibliothèque pour analyser, valider, manipuler et formater des dates. Très utile pour gérer et afficher les dates et heures des réservations de manière cohérente.

Pour installer ces dépendances spécifiques, exécutez la commande suivante dans votre terminal à la racine de votre projet :

```sh
npm install express mysql jsonwebtoken moment
```
### Configuration des variables d'environnement

Ajoutez les informations de connexion MySQL dans votre fichier `db.js` :

```db
  host: 'localhost', // ou l'adresse de votre serveur de base de données
  user: '', // votre nom d'utilisateur MySQL
  password: '', // votre mot de passe MySQL
  database: 'badminton_booking_system' // le nom de votre base de données
```

Remplacez les valeurs par vos propres informations de connexion MySQL.

### Création de la base de données

1. Sauvegardez le script `badminton_booking_system.sql` localement.
2. Ouvrez votre terminal MySQL ou un outil de gestion de base de données MySQL.
3. Connectez-vous à votre serveur MySQL.
4. Créez la base de données en exécutant : `CREATE DATABASE badminton_booking_system;`
5. Sélectionnez la base de données : `USE badminton_booking_system.sql;`
6. Importez les tables et les données : `source chemin/vers/badminton_booking_system.sql;`

### Lancement du serveur

Pour lancer le serveur, exécutez la commande suivante :

```sh
node app.js
```

### URL d'entrée de l'API

Une fois le serveur démarré, votre API sera accessible à l'adresse :

```
http://localhost:3000/
```

## Conception

## Dictionnaire de données - Badminton Booking System

Le tableau ci-dessous décrit la structure de données pour l'API de la base de données `badminton_booking_system`.

| No | Libellé/Désignation          | Code               | Type    | Obligatoire? | Taille | Commentaires                                      |
|---:|:-----------------------------|:-------------------|:--------|:-------------|-------:|:--------------------------------------------------|
|  0 | ID Utilisateur               | user_id            | INT     | Oui          |    -   | Clé primaire, auto-incrémentée                    |
|  1 | Pseudo            | username           | VARCHAR | Oui          |   30   | Unique, identifiant de l'utilisateur              |
|  2 | ID Court                     | court_id           | CHAR    | Oui          |    1   | Clé primaire, identifiant unique du court         |
|  3 | Statut du Court              | status             | ENUM    | Oui          |    -   | Valeurs: 'available', 'unavailable'               |
|  4 | ID Réservation               | reservation_id     | INT     | Oui          |    -   | Clé primaire, auto-incrémentée                    |
|  5 | Date de la Réservation       | reservation_date   | DATE    | Oui          |    -   | Date de la réservation                            |
|  6 | Heure de Début               | start_time         | TIME    | Oui          |    -   | Heure de début de la réservation                  |
|  7 | Heure de Fin                 | end_time           | TIME    | Oui          |    -   | Heure de fin de la réservation                    |
|  8 | Statut de la Réservation     | status             | VARCHAR | Oui          |   20   | Valeurs typiques: 'confirmed', 'canceled'         |
|  9 | ID Utilisateur (Réservation) | user_id            | INT     | Oui          |    -   | Clé étrangère vers la table `users`               |
| 10 | ID Court (Réservation)       | court_id           | CHAR    | Oui          |    1   | Clé étrangère vers la table `courts`              |
| 11 | ID Admin                     | admin_id           | INT     | Oui          |    -   | Clé primaire, auto-incrémentée                    |
| 12 | Pseudo Admin                 | admin_username     | VARCHAR | Oui          |   30   | Unique, nom d'utilisateur pour l'admin            |
| 13 | Hash du Mot de passe Admin   | password_hash      | VARCHAR | Oui          |  255   | Hash du mot de passe pour sécurité accrue         |

Ce tableau reprend la structure et les champs des différentes tables telles que définies dans votre script SQL, en fournissant des détails sur le type de données, la taille, et toute contrainte ou commentaire pertinent pour chaque colonne.


### API Routes

Ressources exposées par l'API.

**Note:** toutes les ressources autorisent les méthodes HTTP OPTIONS et HEAD.

| No | Nom de la ressource              | URL                             | Méthode | Paramètres d'URL     | Commentaires                                                   |
|---:|:---------------------------------|:--------------------------------|:--------|:---------------------|:---------------------------------------------------------------|
|  0 | Authentification Admin           | `/admin/login`                  | POST    |                      | Authentification admin et génération de JWT                    |
|  1 | Désactivation d'un Court         | `/admin/court`                  | POST    |                      | Modifier le statut d'un court, admin avec JWT                  |
|  2 | Accueil (index.html)                         | `/`                             | GET     |                      | Page d'accueil avec formulaire                                 |
|  3 | Création d'Utilisateur           | `/users`                        | POST    |                      | Créer un nouvel utilisateur                                    |
|  4 | Réservation (reserve.html)                      | `/reserve`                      | GET     |                      | Afficher la page de réservation                                |
|  5 | Création de Réservation          | `/reserve`                      | POST    |                      | Créer une nouvelle réservation                                 |
|  6 | Liste des Réservations Utilisateur| `/users/:username/reservations`| GET     | `username`           | Récupérer les réservations d'un utilisateur spécifique         |
|  7 | Annulation de Réservation        | `/users/:username/reservations/:reservationId` | DELETE | `username`, `reservationId` | Annuler une réservation spécifique              |
|  8 | Login Utilisateur ( login.html)               | `/login`                        | GET     |                      | Afficher la page de login utilisateur                          |
|  9 | Liste des Réservations par Utilisateur | `/login`                        | POST    |                      | Gérer la soumission de login et afficher les réservations      |
| 10 | Détails Utilisateur              | `/users/:username`              | GET     | `username`           | Récupérer les détails d'un utilisateur spécifique              |



### Entités (base de données)

#### User (Utilisateur)
- `user_id` (INT) : Identifiant unique de l'utilisateur, auto-incrémenté.
- `username` (VARCHAR) : Pseudo, unique.

#### Courts (Terrains)
- `court_id` (CHAR) : Identifiant unique du court, une lettre.
- `status` (ENUM) : Statut du court, valeurs possibles 'available' ou 'unavailable'.

#### Reservation (Réservation)
- `reservation_id` (INT) : Identifiant unique de la réservation, auto-incrémenté.
- `user_id` (INT) : Clé étrangère liée à `User.user_id`.
- `court_id` (CHAR) : Clé étrangère liée à `Courts.court_id`.
- `reservation_date` (DATE) : La date de la réservation.
- `start_time` (TIME) : Heure de début de la réservation.
- `end_time` (TIME) : Heure de fin de la réservation.
- `status` (VARCHAR) : Statut de la réservation, valeurs typiques 'confirmed', 'canceled'.

#### Admin (Administrateur)
- `admin_id` (INT) : Identifiant unique de l'administrateur, auto-incrémenté.
- `admin_username` (VARCHAR) : Pseudo de l'administrateur, unique.
- `password_hash` (VARCHAR) : Hash du mot de passe pour la sécurité.





### Modèle Conceptuel des Données (MCD) pour la base de données `badminton_booking_system`

Le MCD suivant décrit les entités et leurs relations dans un format de diagramme UML simplifié.

#### Entités et Attributs

##### User (Utilisateur)
- **id** : INT, clé primaire, auto-incrémentée.
- **pseudo** : VARCHAR(45), unique, non nul.

##### Courts (Terrains)
- **id** : CHAR(1), clé primaire.
- **statut** : ENUM('available', 'unavailable'), non nul, par défaut 'available'.

##### Reservation (Réservation)
- **id** : INT, clé primaire, auto-incrémentée.
- **start_time** : DATETIME, non nul.
- **end_time** : DATETIME, non nul.
- **status** : ENUM('confirmed', 'canceled'), non nul, par défaut 'confirmed'.
- **user_id** : INT, non nul, clé étrangère vers `User.id`.
- **courts_id** : CHAR(1), non nul, clé étrangère vers `Courts.id`.

##### Admin (Administrateur)
- **id** : INT, clé primaire, auto-incrémentée.
- **pseudo** : VARCHAR(45), unique, non nul.
- **password** : VARCHAR(45), non nul.

#### Relations

- **User -> Reservation** : Un-à-plusieurs (Un utilisateur peut avoir plusieurs réservations).
- **Courts -> Reservation** : Un-à-plusieurs (Un terrain peut avoir plusieurs réservations).

#### Représentation des Relations

- `User.id` ---< `Reservation.user_id`
- `Courts.id` ---< `Reservation.courts_id`

> Les symboles ---< indiquent une relation de un-à-plusieurs.


### Remarques

### Références

#### Documentation Officielle
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
#### Forums et Communautés
- [Stack Overflow](https://stackoverflow.com/)

