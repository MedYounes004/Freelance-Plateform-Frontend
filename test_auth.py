#!/usr/bin/env python3
import urllib.request
import json
import time

# Attendre que le serveur soit prêt
time.sleep(2)

print("=== TEST AUTHENTIFICATION ===\n")

# Test 1: Enregistrement
print("1️⃣  TEST ENREGISTREMENT")
user_data = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'password': 'TestPassword123!',
    'user_type': 'freelancer'
}

try:
    req = urllib.request.Request(
        'http://localhost:5000/api/auth/register',
        data=json.dumps(user_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    response = urllib.request.urlopen(req, timeout=5)
    result = json.loads(response.read().decode('utf-8'))
    token = result.get('token', '')
    user_id = result.get('user_id', '')
    print("✓ Enregistrement réussi")
    print(f"  Token: {token[:30]}...")
    print(f"  User ID: {user_id}")
    print(f"  Email: {result['email']}")
except Exception as e:
    print(f"✗ Erreur enregistrement: {e}")
    token = None
    user_id = None

print("\n2️⃣  TEST CONNEXION")
login_data = {
    'email': 'john@example.com',
    'password': 'TestPassword123!'
}

try:
    req = urllib.request.Request(
        'http://localhost:5000/api/auth/login',
        data=json.dumps(login_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    response = urllib.request.urlopen(req, timeout=5)
    result = json.loads(response.read().decode('utf-8'))
    token = result.get('token', '')
    print("✓ Connexion réussie")
    print(f"  Token: {token[:30]}...")
    print(f"  User ID: {result['user_id']}")
except Exception as e:
    print(f"✗ Erreur connexion: {e}")
    token = None

print("\n3️⃣  TEST ACCÈS AUX PROJETS AVEC TOKEN")
if token:
    try:
        req = urllib.request.Request(
            'http://localhost:5000/api/projects',
            headers={'Authorization': f'Bearer {token}'}
        )
        response = urllib.request.urlopen(req, timeout=5)
        result = json.loads(response.read().decode('utf-8'))
        projects = result.get('projects', [])
        print("✓ Accès aux projets réussi")
        print(f"  Nombre de projets: {len(projects)}")
        if projects:
            print(f"  Premier projet: {projects[0]['title']}")
    except Exception as e:
        print(f"✗ Erreur accès projets: {e}")
else:
    print("⚠️  Pas de token, test ignoré")

print("\n✅ Tests complétés!")
