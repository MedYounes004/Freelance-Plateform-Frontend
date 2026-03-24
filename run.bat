@echo off
REM 🚀 Quickstart Script for Windows - Démarrer l'application complète

cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🚀 FREELANCE PLATFORM - Application Complète              ║
echo ║     Backend Flask + Frontend Angular/Ionic                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé!
    echo Veuillez installer Python 3.8+ depuis https://www.python.org
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé!
    echo Veuillez installer Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Dépendances système vérifiées
echo.

REM Démarrer le backend
echo ═══════════════════════════════════════════════════════════════
echo 🔷 DÉMARRAGE DU BACKEND FLASK
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend

if not exist "venv" (
    echo 📦 Création d'un environnement virtuel...
    python -m venv venv
)

echo 🔧 Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo 📥 Installation des dépendances...
pip install -q -r requirements.txt

echo.
echo 🚀 Démarrage du serveur Flask...
echo 📍 L'API sera accessible sur: http://localhost:5000
echo.

REM Démarrer Flask dans une nouvelle fenêtre
start "Flask Backend" cmd /k python run.py

REM Attendre que Flask démarre
timeout /t 2 /nobreak

cd ..

REM Démarrer le frontend
echo.
echo ═══════════════════════════════════════════════════════════════
echo 🔶 DÉMARRAGE DU FRONTEND ANGULAR/IONIC
echo ═══════════════════════════════════════════════════════════════
echo.

echo 📥 Vérification des dépendances Angular...
if not exist "node_modules" (
    echo Installation en cours... ^(cela peut prendre quelques minutes^)
    call npm install --q
)

echo.
echo 🚀 Démarrage du serveur de développement Ionic...
echo 📍 L'application sera accessible sur: http://localhost:4200
echo.

REM Démarrer Ionic dans une nouvelle fenêtre
start "Ionic Frontend" cmd /k ionic serve

REM Afficher le résumé
timeout /t 3 /nobreak

cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  ✅  APPLICATION DÉMARRÉE AVEC SUCCÈS!                       ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📱 Frontend ^(Ionic^):
echo    URL: http://localhost:4200
echo    Status: Ouvert dans le navigateur par défaut
echo.
echo 🔧 Backend ^(Flask^):
echo    URL: http://localhost:5000
echo    API: http://localhost:5000/api
echo    Santé: http://localhost:5000/api/health
echo.
echo 💾 Base de données:
echo    MongoDB: mongodb://localhost:27017/freelance_platform
echo    ^(Assurez-vous que MongoDB est en cours d'exécution^)
echo.
echo 📚 Documentation:
echo    - Integration Guide: ./INTEGRATION_GUIDE.md
echo    - Backend API: ./backend/API_DOCUMENTATION.md
echo    - Backend Setup: ./backend/README.md
echo.
echo 🛑 ARRÊT:
echo    Fermez les fenêtres Flask et Ionic pour arrêter l'application
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

pause
