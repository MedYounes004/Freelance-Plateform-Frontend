# 🔗 Guide d'intégration Front-Backend

Cette documentation explique comment le frontend Angular est connecté au backend Flask pour la plateforme Freelance.

## 📋 Architecture de l'intégration

```
┌─────────────────────────────────────────────────────────┐
│                   Angular Frontend (Ionic)              │
│              ├─ Components      (Pages)                 │
│              ├─ Services        (API)                   │
│              ├─ Interceptors    (JWT)                   │
│              └─ Models          (Interfaces)            │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP Calls
                    (REST API Endpoints)
┌─────────────────────────────────────────────────────────┐
│                   Flask Backend                         │
│              ├─ Routes         (Endpoints)              │
│              ├─ Models         (MongoDB)                │
│              ├─ Services       (Business Logic)         │
│              └─ config         (Configuration)          │
└─────────────────────────────────────────────────────────┘
```

## 🔌 Configuration API

### Fichier: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'  // URL du backend Flask
};
```

### Fichier: `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.freelance-platform.com/api'  // URL de production
};
```

## 📦 Services Angular

### 1. **ProjectService** - `src/app/services/project.service.ts`

Gère toutes les opérations liées aux projets.

```typescript
// Récupérer tous les projets
projectService.getProjects(page, limit, status, category, skill)

// Récupérer un projet
projectService.getProject(projectId)

// Créer un projet
projectService.createProject(projectData)

// Mettre à jour un projet
projectService.updateProject(projectId, projectData)

// Supprimer un projet
projectService.deleteProject(projectId)

// Mettre à jour le statut
projectService.updateProjectStatus(projectId, status)

// Rechercher les projets
projectService.searchProjects(query, page, limit)

// Récupérer les projets d'un client
projectService.getClientProjects(clientId)
```

### 2. **ProposalService** - `src/app/services/proposal.service.ts`

Gère les propositions de freelancers.

```typescript
// Récupérer les propositions d'un projet
proposalService.getProposals(projectId, page, limit)

// Récupérer une proposition
proposalService.getProposal(proposalId)

// Créer une proposition
proposalService.createProposal(proposalData)

// Mettre à jour une proposition
proposalService.updateProposal(proposalId, proposalData)

// Supprimer une proposition
proposalService.deleteProposal(proposalId)

// Mettre à jour le statut
proposalService.updateProposalStatus(proposalId, status)
```

### 3. **AuthService** - `src/app/services/auth.service.ts`

Gère l'authentification et les tokens JWT.

```typescript
// Récupérer le token
authService.getToken()

// Stocker le token
authService.setToken(token, userId)

// Se déconnecter
authService.logout()

// Vérifier si connecté
authService.isAuthenticated()

// Récupérer l'ID utilisateur
authService.getCurrentUserId()

// Vérifier si le token est expiré
authService.isTokenExpired()
```

## 🔐 Interceptor JWT

### Fichier: `src/app/interceptors/jwt.interceptor.ts`

L'interceptor ajoute automatiquement le token JWT à chaque requête HTTP vers l'API.

**Fonctionnement:**
1. Récupère le token du localStorage
2. Ajoute le header `Authorization: Bearer <token>`
3. Gère les erreurs 401 (token expiré)

**Enregistrement:** Dans `src/main.ts`
```typescript
{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
```

## 📄 Modèles TypeScript

### Fichier: `src/app/models/project.model.ts`

Définit toutes les interfaces pour les projets et propositions.

```typescript
export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budget_type: BudgetType;  // fixed, hourly, range
  category: string;
  skills: string[];
  status: ProjectStatus;     // open, in_progress, completed, closed
  client_id: string;
  experience_level: ExperienceLevel;
  timeline: Timeline;
  proposals_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  _id: string;
  project_id: string;
  freelancer_id: string;
  bid_amount: number;
  message: string;
  estimated_duration: string;
  status: ProposalStatus;  // pending, accepted, rejected, withdrawn
  created_at: string;
  updated_at: string;
}
```

## 🎯 Utilisation dans les Composants

### ProjectsPage - `src/app/projects-screen/projects-screen.page.ts`

```typescript
export class ProjectsPage implements OnInit, OnDestroy {
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // Charge les projets au démarrage
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService
      .getProjects(page, limit, status)
      .subscribe({
        next: (response) => {
          this.projects = response.projects;
        },
        error: (error) => {
          // Gérer l'erreur
        }
      });
  }

  onSearch(query: string): void {
    this.projectService.searchProjects(query).subscribe(/* ... */);
  }
}
```

### ProjectDetailsPage - `src/app/project-details-screen/project-details-screen.page.ts`

```typescript
export class ProjectDetailsPage implements OnInit, OnDestroy {
  constructor(
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProject();
    this.loadProposals();
  }

  loadProject(): void {
    this.projectService.getProject(projectId).subscribe(/* ... */);
  }

  loadProposals(): void {
    this.proposalService.getProposals(projectId).subscribe(/* ... */);
  }

  submitProposal(): void {
    this.proposalService.createProposal(proposalData).subscribe(/* ... */);
  }
}
```

## 🔄 Flux de données

### 1. **Récupération des projets**

```
User Opens App
    ↓
ProjectsPage.ngOnInit()
    ↓
ProjectService.getProjects()
    ↓
HTTP GET http://localhost:5000/api/projects
    ↓
Flask: projects.bp.route('/projects', methods=['GET'])
    ↓
Project.get_all(filters, page, limit)
    ↓
MongoDB Query
    ↓
Return ProjectListResponse
    ↓
Frontend: Display Projects in List
```

### 2. **Création d'une proposition**

```
User Clicks "Submit Proposal"
    ↓
ProjectDetailsPage.submitProposal()
    ↓
AuthService.getCurrentUserId() // Vérifier l'authentification
    ↓
ProposalService.createProposal(proposalData)
    ↓
JwtInterceptor.intercept() // Ajouter le JWT
    ↓
HTTP POST http://localhost:5000/api/proposals
Headers: Authorization: Bearer <token>
Body: {project_id, bid_amount, message, ...}
    ↓
Flask: proposals_bp.route('', methods=['POST'])
    ↓
@token_required decorator // Vérifier le JWT
    ↓
Proposal.create(proposal_data)
    ↓
MongoDB Insert
    ↓
Return CreateProposalResponse
    ↓
Frontend: Show Toast "Proposal submitted!"
    ↓
Reload Proposals List
```

## 🛡️ Sécurité - Authentification JWT

### Flow d'authentification
```
1. User Login
   ├─ POST /api/auth/login
   ├─ Backend génère JWT token
   └─ Frontend stocke le token

2. Requêtes protégées
   ├─ JwtInterceptor ajoute le token
   ├─ Backend @token_required valide le token
   └─ Si invalide → 401 → Frontend logout

3. Logoff
   ├─ AuthService.logout()
   ├─ Supprimer le token du localStorage
   └─ Rediriger vers /login
```

### Stockage du token
- **Lieu:** `localStorage` (clé: `auth_token`)
- **ID utilisateur:** `localStorage` (clé: `user_id`)
- **Sécurité:** Le token est ajouté automatiquement pour chaque requête API

## 🔗 Endpoints utilisés dans le Frontend

### Projets
```
GET    /api/projects                      - Lister tous les projets
GET    /api/projects/<id>                 - Détails d'un projet
POST   /api/projects                      - Créer un projet (JWT)
PUT    /api/projects/<id>                 - Modifier un projet (JWT)
DELETE /api/projects/<id>                 - Supprimer un projet (JWT)
PATCH  /api/projects/<id>/status          - Changer le statut (JWT)
GET    /api/projects/search?q=<query>     - Rechercher les projets
GET    /api/projects/client/<id>          - Projets d'un client
```

### Propositions
```
GET    /api/proposals/<project_id>        - Propositions du projet
GET    /api/proposals/<id>                - Détails d'une proposition
POST   /api/proposals                     - Créer une proposition (JWT)
PUT    /api/proposals/<id>                - Modifier une proposition (JWT)
DELETE /api/proposals/<id>                - Supprimer une proposition (JWT)
PATCH  /api/proposals/<id>/status         - Changer le statut (JWT)
```

## ✅ Checklist d'intégration

- [x] Configuration des environments (dev/prod)
- [x] Services API (Projects, Proposals, Auth)
- [x] Modèles/Interfaces TypeScript
- [x] Interceptor JWT
- [x] Composant ProjectsPage avec appels API
- [x] Composant ProjectDetailsPage avec propositions
- [x] Gestion des erreurs et toasts
- [ ] Services Auth (Login/Register) - À implémenter
- [ ] Gestion des tokens et refresh token - À implémenter
- [ ] Tests unitaires - À implémenter

## 🚀 Lancement de l'application

**Terminal 1 - Backend Flask:**
```bash
cd backend
python run.py
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend Angular:**
```bash
cd .
ionic serve
# App running on http://localhost:4200
```

## 📞 Support

- **Backend API Docs:** Voir [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)
- **Backend Setup:** Voir [backend/README.md](../backend/README.md)
- **Frontend Architecture:** Angular Standalone Components avec Ionic 18

## 🎓 Ressources supplémentaires

- [Angular HttpClient Guide](https://angular.io/guide/http)
- [Angular Interceptors](https://angular.io/api/common/http/HttpInterceptor)
- [RxJS Operators](https://rxjs.dev/api)
- [Ionic Components](https://ionicframework.com/docs/components)
- [jwt.io - Learn about JWT](https://jwt.io)
