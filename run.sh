#!/bin/bash

# 🚀 Quickstart Script - Démarrer l'application complète

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 FREELANCE PLATFORM - Application Complète              ║"
echo "║     Backend Flask + Frontend Angular/Ionic                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier si Python est installé
if ! command -v python &> /dev/null; then
    echo "❌ Python n'est pas installé!"
    echo "Veuillez installer Python 3.8+ depuis https://www.python.org"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo "Veuillez installer Node.js depuis https://nodejs.org"
    exit 1
fi

echo "✅ Dépendances système vérifiées"
echo ""

# Démarrer le backend
echo "═══════════════════════════════════════════════════════════════"
echo "🔷 DÉMARRAGE DU BACKEND FLASK"
echo "═══════════════════════════════════════════════════════════════"
echo ""

cd backend

if [ ! -d "venv" ]; then
    echo "📦 Création d'un environnement virtuel..."
    python -m venv venv
fi

echo "🔧 Activation de l'environnement virtuel..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

echo "📥 Installation des dépendances..."
pip install -q -r requirements.txt

echo ""
echo "🚀 Démarrage du serveur Flask..."
echo "📍 L'API sera accessible sur: http://localhost:5000"
echo "📚 Documentation: http://localhost:5000 (avec Swagger si configuré)"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur..."
echo ""

# Démarrer Flask en arrière-plan
python run.py &
FLASK_PID=$!

sleep 2

# Vérifier que Flask s'est bien lancé
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "❌ Erreur au démarrage du backend Flask!"
    exit 1
fi

echo "✅ Backend Flask démarré (PID: $FLASK_PID)"
echo ""

# Démarrer le frontend
echo "═══════════════════════════════════════════════════════════════"
echo "🔶 DÉMARRAGE DU FRONTEND ANGULAR/IONIC"
echo "═══════════════════════════════════════════════════════════════"
echo ""

cd ../

echo "📥 Vérification des dépendances Angular..."
if [ ! -d "node_modules" ]; then
    echo "Installation en cours... (cela peut prendre quelques minutes)"
    npm install --q
fi

echo ""
echo "🚀 Démarrage du serveur de développement Ionic..."
echo "📍 L'application sera accessible sur: http://localhost:4200"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur..."
echo ""

# Démarrer Ionic
ionic serve --no-open &
IONIC_PID=$!

sleep 3

# Afficher le résumé
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ✅  APPLICATION DÉMARRÉE AVEC SUCCÈS!                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Frontend (Ionic):"
echo "   URL: http://localhost:4200"
echo "   Status: Ouvert dans le navigateur par défaut"
echo ""
echo "🔧 Backend (Flask):"
echo "   URL: http://localhost:5000"
echo "   API: http://localhost:5000/api"
echo "   Santé: http://localhost:5000/api/health"
echo ""
echo "💾 Base de données:"
echo "   MongoDB: mongodb://localhost:27017/freelance_platform"
echo "   (Assurez-vous que MongoDB est en cours d'exécution)"
echo ""
echo "📚 Documentation:"
echo "   - Integration Guide: ./INTEGRATION_GUIDE.md"
echo "   - Backend API: ./backend/API_DOCUMENTATION.md"
echo "   - Backend Setup: ./backend/README.md"
echo ""
echo "🛑 ARRÊT:"
echo "   Appuyez sur Ctrl+C pour arrêter l'application"
echo "   Ou fermez cette fenêtre"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Attendre que l'utilisateur arrête
wait

# Nettoyage
echo ""
echo "🔒 Arrêt des serveurs..."
kill $FLASK_PID 2>/dev/null
kill $IONIC_PID 2>/dev/null

echo "✅ Application arrêtée"
