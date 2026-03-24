# 📖 Quick Start - Créer un Projet

**⏱️ Temps de lecture:** 2 minutes

---

## 🎯 TL;DR (Too Long; Didn't Read)

✅ **Le bouton "+ New" est maintenant opérationnel!**

```
1. Aller sur Projects
2. Cliquer "+ New"
3. Remplir infos du projet
4. Cliquer "Create Project"
5. ✅ Projet créé!
```

---

## 🚀 Démarrer

### **1. Lancer l'app**
```bash
ionic serve
```

### **2. Aller sur "Projects"**
```
Navigation → Projects
```

### **3. Cliquer sur "+ New"**
```
Bouton orange en haut à droite
```

### **4. Voir le formulaire**
```
Page de création de projet s'affiche
```

---

## 📝 Champs à remplir

### **Obligatoires** (🔴 REQUIS)
- [x] **Project Title** - Titre du projet (min 5 caractères)
- [x] **Client Name** - Nom du client (min 3 caractères)
- [x] **Budget** - Montant en $ (> 0)
- [x] **Deadline** - Date limite
- [x] **Category** - Type de projet (dropdown)
- [x] **Description** - Au moins 1 paragraphe
  - Cliquer "+ Add" pour ajouter plus
  - Cliquer "X" pour supprimer
- [x] **Required Skills** - Au moins 1 compétence
  - Cliquer "+ Add" pour ajouter plus
  - Cliquer "X" pour supprimer

### **Optionnels** (⚪ FACULTATIF)
- [ ] **Duration** - Durée estimée (ex: "4 weeks")
- [ ] **Client Avatar URL** - Lien de l'avatar
- [ ] **Milestones** - Jalons du projet
  - Cliquer "+ Add" pour laisser ajouter

---

## ✨ Exemple de création

```
Title:     "Mobile App Development"
Client:    "TechStart Inc."
Budget:    5000
Deadline:  2026-05-30
Category:  "Mobile Development"
Duration:  "6 weeks"

Description (ajouter 2):
  1. "Développement app iOS et Android"
  2. "Intégration API backend"

Skills (ajouter 3):
  1. "React Native"
  2. "Firebase"
  3. "REST API"

Milestones (optionnel):
  1. Design Phase - $1000
  2. Development - $3000
  3. Testing - $1000
```

---

## 🎨 Formulaire

```
┌─────────────────────────────────────┐
│  ← Create Project                   │
├─────────────────────────────────────┤
│                                     │
│ BASIC INFORMATION                   │
│ ├─ Project Title        [input]     │
│ ├─ Client Name          [input]     │
│ ├─ Budget               [input]     │
│ ├─ Deadline             [date]      │
│ ├─ Category             [dropdown]  │
│ ├─ Duration             [input]     │
│ └─ Avatar URL           [input]     │
│                                     │
│ DESCRIPTION              [+ Add]    │
│ ├─ [textarea 1]         [X]         │
│ ├─ [textarea 2]         [X]         │
│                                     │
│ REQUIRED SKILLS          [+ Add]    │
│ ├─ [input: Flutter]     [X]         │
│ ├─ [input: React]       [X]         │
│                                     │
│ MILESTONES (optional)    [+ Add]    │
│ ├─ [Title, Payment]     [X]         │
│                                     │
├─────────────────────────────────────┤
│  [Cancel]        [Create Project]   │
└─────────────────────────────────────┘
```

---

## ✅ Validation

**Le bouton "Create Project" sera GRISÉ si:**
- [ ] Title est vide ou < 5 caractères
- [ ] Client est vide ou < 3 caractères
- [ ] Budget est vide ou = 0
- [ ] Deadline est vide
- [ ] Category n'est pas sélectionné
- [ ] Description array est vide
- [ ] Skills array est vide

**Une fois tous les champs remplis correctement:**
- ✅ Bouton devient bleu et cliquable

---

## 🔄 Après la création

### **Si succès (✅)**
```
1. Toast notification: "Project created successfully!"
2. Spinner disparaît
3. Redirection automatique vers /projects
4. Nouveau projet visible dans la liste
```

### **Si erreur (❌)**
```
1. Message d'erreur affiché en rouge
2. Toast notification: "[Message d'erreur]"
3. Vous restez sur le formulaire
4. Vous pouvez corriger et réessayer
```

---

## 🐛 Dépannage rapide

**Q: Le bouton "Create Project" ne se clique pas?**
A: Remplissez tous les champs obligatoires correctement

**Q: Erreur "Project not found"?**
A: Vérifiez que le backend est actif:
```bash
python run.py
```

**Q: Les données ne s'enregistrent pas?**
A: Vérifiez:
1. Backend en cours d'exécution
2. MongoDB actif
3. Console F12 → Network → voir la requête POST
4. Logs du serveur

---

## 📚 Documentation complète

Pour plus de détails, consultez:
- **[CREATE_PROJECT_GUIDE.md](CREATE_PROJECT_GUIDE.md)** - Guide complet
- **[SETUP_NEW_BUTTON.md](SETUP_NEW_BUTTON.md)** - Configuration détaillée
- **[FRONTEND_BACKEND_ALIGNMENT.md](FRONTEND_BACKEND_ALIGNMENT.md)** - Alignement global

---

## 🎉 C'est tout!

Vous êtes prêt à créer des projets! 🚀

```
Projects → "+ New" → Remplir → Create → ✅ Fait!
```

---

**Questions? Consultez les fichiers MD fournis! 📖**
