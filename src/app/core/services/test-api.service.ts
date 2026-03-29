// test-api.service.ts - Ajouter ce fichier temporaire pour tester

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private http: HttpClient) { }

  /**
   * Test simple de la connexion API
   */
  testConnection() {
    return this.http.get('http://localhost:5000/api/projects', {
      params: { limit: '1' }
    });
  }

  /**
   * Test création de projet avec données minimales
   */
  testCreateProject() {
    const testData = {
      title: 'Test Project',
      client: 'Test Client',
      budget: 1000,
      deadline: '2026-04-30',
      category: 'Web Development',
      description: ['Test description'],
      skills: ['Test skill']
    };

    return this.http.post('http://localhost:5000/api/projects', testData);
  }
}
