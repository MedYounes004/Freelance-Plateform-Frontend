# 🧪 Guide de Test - Intégration Front-Backend

## Ce document explique comment tester l'intégration complète

## ✅ Prérequis

- [ ] Backend Flask en cours d'exécution (`python run.py`)
- [ ] Frontend Angular/Ionic en cours d'exécution (`ionic serve`)
- [ ] MongoDB démarré
- [ ] Navigateur moderne (Chrome, Firefox, Edge)

## 🧪 Tests de base

### Test 1: Vérifier la santé du Backend

**Endpoint:** `GET http://localhost:5000/api/health`

**Via navigateur:**
```
http://localhost:5000/api/health
```

**Réponse attendue:**
```json
{
  "status": "healthy"
}
```

**Via cURL:**
```bash
curl http://localhost:5000/api/health
```

---

### Test 2: Récupérer les projets

**Endpoint:** `GET http://localhost:5000/api/projects`

**Via navigateur:**
```
http://localhost:5000/api/projects?page=1&limit=10
```

**Réponse attendue:**
```json
{
  "projects": [
    {
      "_id": "...",
      "title": "Project Title",
      "description": "...",
      "budget": 5000,
      ...
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 10
}
```

**Via cURL:**
```bash
curl http://localhost:5000/api/projects?page=1&limit=10
```

---

### Test 3: Tester le Frontend - Page Projets

1. Ouvrir `http://localhost:4200` dans le navigateur
2. Naviguer vers la page Projects
3. Vérifier que la liste est chargée depuis l'API
4. Chercher le message "Loading projects..." ou la liste
5. Vérifier les projets affichés

**Observe:**
- Spinner pendant le chargement
- Liste des projets affichée
- Pas d'erreur dans la console (F12)

---

## 🔐 Tests d'Authentification

### Test 4: Créer un projet (Nécessite JWT)

**Endpoint:** `POST http://localhost:5000/api/projects`

**Atends que la page Login soit créée pour obtenir un token**

Avec token valide:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test Description",
    "budget": 1000,
    "budget_type": "fixed",
    "category": "web-development",
    "skills": ["JavaScript"],
    "experience_level": "intermediate",
    "timeline": "1-3 months"
  }'
```

**Réponse attendue (201 Created):**
```json
{
  "message": "Projet créé avec succès",
  "project_id": "507f1f77bcf86cd799439011"
}
```

**Sans token (401 Unauthorized):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

**Réponse attendue (401):**
```json
{
  "message": "Token manquant"
}
```

---

## 🎯 Tests de Flux Complet

### Test 5: Flux Recherche et Détails

1. **Frontend - Accéder à Projects**
   ```
   http://localhost:4200
   ```

2. **Vérifier le chargement des données**
   - Ouvrir DevTools (F12)
   - Aller à l'onglet Network
   - Chercher la requête `GET /api/projects`
   - Staus: 200 OK

3. **Chercher un projet**
   - Entrer un terme dans la barre de recherche
   - Vérifier la requête `GET /api/projects/search?q=...`
   - Voir les résultats filtrés

4. **Filtrer par statut**
   - Cliquer sur un onglet de filtre
   - Vérifier la requête `GET /api/projects?status=...`
   - Voir seulement les projets du statut sélectionné

5. **Voir les détails**
   - Cliquer sur un projet
   - Voir les détails chargés depuis `/api/projects/<id>`
   - Vérifier les propositions affichées

---

## 🔍 Tests avec les Outils du Navigateur

### Ouvrir DevTools

Appuyez sur **F12** ou clic droit → **Inspect**

### Onglet Network

1. Recharger la page (Ctrl+R)
2. Voir toutes les requêtes HTTP
3. Chercher les requêtes vers `http://localhost:5000/api/*`
4. Cliquer sur chaque requête pour voir:
   - Status (200, 401, 500, etc.)
   - Request Headers
   - Response Body

### Onglet Console

Vérifier qu'il n'y a pas d'erreurs rouges:
```javascript
// Les erreurs s'afficheraient como ça:
// ❌ Error: Failed to load projects from API
```

### Onglet Application/Storage

Vérifier le stockage JWT (après login):
1. LocalStorage → clés recherchées:
   - `auth_token` (JWT token)
   - `user_id` (ID utilisateur)

---

## 🚀 Tests avec Postman

### Installation

Télécharger Postman: https://www.postman.com/downloads/

### Tester un Endpoint

1. **Ouvrir Postman**
2. **Créer une nouvelle requête:**
   - Method: GET
   - URL: `http://localhost:5000/api/projects`
   - Headers: 
     ```
     Content-Type: application/json
     ```
3. **Cliquer Send**
4. **Voir la réponse**

### Importer la Collection

Créer un fichier `postman_collection.json`:

```json
{
  "info": {
    "name": "Freelance Platform API",
    "description": "API endpoints pour la plateforme freelance"
  },
  "item": [
    {
      "name": "Get All Projects",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/projects?page=1&limit=10"
      }
    },
    {
      "name": "Get Project",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/projects/{{project_id}}"
      }
    },
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/projects",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"},
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"title\": \"Test\", \"description\": \"Test\", \"budget\": 1000}"
        }
      }
    }
  ]
}
```

---

## 📊 Tests Backend (Python)

### Lancer le fichier de test

```bash
cd backend
python test_api.py
```

**Sortie attendue:**
```
🚀 Tests de l'API Projects
==================================================
Test Home Route
--------------------------------------------------
Status: 200
Response: {'message': 'Backend Freelance Platform fonctionne !'}

Test Health Check
--------------------------------------------------
Status: 200
Response: {'status': 'healthy'}

...
```

---

## ⚠️ Dépannage des Erreurs

### Erreur: Connection Refused

```
Cannot GET http://localhost:5000/api/projects
```

**Causes possibles:**
1. Backend Flask non démarré
2. Port incorrect dans environment.ts
3. Firewall bloquant la connexion

**Solutions:**
1. Vérifier que Flask est en cours d'exécution:
   ```bash
   cd backend && python run.py
   ```
2. Vérifier `http://localhost:5000/` directement dans le navigateur
3. Vérifier environment.ts:
   ```typescript
   apiUrl: 'http://localhost:5000/api'
   ```

### Erreur: CORS Block

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Cause:** Flask CORS non configuré

**Solution:** Vérifier que Flask a CORS:
```python
from flask_cors import CORS
CORS(app)
```

### Erreur: 401 Unauthorized

```json
{"message": "Token manquant"}
```

**Cause:** Tentative de requête protégée sans token

**Solutions:**
1. Vérifier que l'utilisateur est logué
2. Vérifier que le token n'est pas expiré
3. Vérifier que le JWT est stocké correctement:
   ```javascript
   // Dans DevTools Console:
   localStorage.getItem('auth_token')
   ```

### Erreur: 500 Internal Server Error

```json
{"error": "Erreur serveur interne"}
```

**Cause:** Erreur dans le code backend

**Solutions:**
1. Vérifier les logs Flask:
   ```
Traceback (most recent call last):
  File "...", line X, in function
    ...
   ```
2. Vérifier que MongoDB est running:
   ```bash
   # MacOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

---

## 📈 Cas de test complets

### Cas 1: Scénario client (Publier un projet)

**Prérequis:** 
- [ ] Support d'authentification
- [ ] Page Create Project

1. **Login** (email/password)
2. **Créer un projet** avec les infos
3. **API:** POST /projects avec JWT
4. **Réponse:** Project créé avec ID
5. **Frontend:** Confirmation et redirection

### Cas 2: Scénario freelancer (Postuler)

**Prérequis:**
- [ ] Support d'authentification
- [ ] Logique de vérification (ne pas pouvoir postuler sur ses propres projets)

1. **Login** comme freelancer
2. **Ouvrir les projets**
3. **Voir les détails** d'un projet (pas le sien)
4. **Soumettre une proposition** avec montant + message
5. **API:** POST /proposals avec JWT
6. **Frontend:** Confirmation

### Cas 3: Gestion du statut d'une proposition

**Prérequis:**
- [ ] Client logué
- [ ] Voir ses propositions reçues
- [ ] Pouvoir accepter/rejeter

1. **Login** comme client
2. **Voir ses projets**
3. **Voir les propositions** reçues
4. **Accepter/Rejeter** une proposition
5. **API:** PATCH /proposals/<id>/status
6. **Frontend:** Mise à jour en temps réel

---

## ✅ Checklist de test avant déploiement

### Backend Flask
- [ ] Health check pass
- [ ] Tous les endpoints GET (sans auth)
- [ ] Endpoints POST/PUT/DELETE avec token valide
- [ ] Endpoints POST/PUT/DELETE sans token → 401
- [ ] Recherche fonctionne
- [ ] Filtrage fonctionne
- [ ] CORS configuré
- [ ] Erreurs properly formatted

### Frontend Angular
- [ ] Page Projects charge les données
- [ ] Recherche fonctionne
- [ ] Filtrage fonctionne
- [ ] Détails du projet s'ouvrent
- [ ] Pas d'erreur dans console
- [ ] Loading spinner affiche pendant les requêtes
- [ ] Messages d'erreur affichent correctement
- [ ] Pull-to-refresh fonctionne

### Intégration
- [ ] JWT est stocké après login
- [ ] JWT est envoyé dans les requêtes protégées
- [ ] 401 → logout automatique
- [ ] Network tab montre les bonnes requêtes
- [ ] Pas de CORS errors
- [ ] Pas de Mixed Content warnings

---

## 📞 Ressources

- [Network Tab Tutorial](https://developer.chrome.com/docs/devtools/network/)
- [Postman Tutorials](https://learning.postman.com/)
- [curl Documentation](https://curl.se/docs/)
- [Flask Debugging](https://flask.palletsprojects.com/en/2.3.x/debugging/)
- [Angular HttpClient](https://angular.io/guide/http)
