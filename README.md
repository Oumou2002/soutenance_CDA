Soutenance CDA – Plateforme d’Apprentissage
 Description du projet

MySkillHub est une application web développée dans le cadre de ma soutenance CDA (Concepteur Développeur d’Applications).
L’application permet :

La gestion des cours et des modules.

L’inscription et l’authentification des utilisateurs (étudiants et formateurs).

Le suivi des étudiants (progression, notes, activités).

Une interface moderne et intuitive (Frontend en React).

Technologies utilisées

Backend : Django / Django REST Framework

Frontend : React + TailwindCSS

Base de données : SQLite (développement), PostgreSQL (production possible)

Tests : Unittest intégré avec Django

Gestion des utilisateurs : Django custom user model

Prérequis

Avant de lancer le projet, vous devez avoir installé :

Python 3.9+

react.js
 et npm

Git

(Optionnel) PostgreSQL
 si vous ne voulez pas utiliser SQLite

Installation du projet
1Cloner le dépôt
git clone https://github.com/Oumou2002/soutenance_CDA.git
cd soutenance_CDA

2️Installation du backend
cd backend
python -m venv venv
source venv/bin/activate   # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Le backend est disponible sur http://127.0.0.1:8000/

3️Installation du frontend
cd frontend
npm install
npm start


 Le frontend est disponible sur http://localhost:3000/

Lancer les tests
cd backend
python manage.py test

 Structure du projet
soutenance_CDA/
├── backend/       # Code Django (API, modèles, tests, auth)
├── frontend/      # Code React (UI, composants, pages)
├── README.md      # Documentation du projet
├── requirements.txt # Dépendances backend

Auteur

Projet réalisé par Oumou Mamoudou Sow dans le cadre de la soutenance CDA (Concepteur Développeur d’Applications).