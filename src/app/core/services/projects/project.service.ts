import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Project,
  CreateProjectRequest,
  CreateProjectResponse,
  ProjectListResponse,
  ProjectStatus
} from '../../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les projets avec pagination et filtrage
   */
  getProjects(
    page: number = 1,
    limit: number = 10,
    status?: ProjectStatus,
    category?: string,
    skill?: string
  ): Observable<ProjectListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (skill) {
      params = params.set('skill', skill);
    }

    return this.http.get<ProjectListResponse>(this.apiUrl, { params });
  }

  /**
   * Récupère un projet par ID
   */
  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }

  /**
   * Crée un nouveau projet
   */
  createProject(projectData: CreateProjectRequest): Observable<CreateProjectResponse> {
    return this.http.post<CreateProjectResponse>(this.apiUrl, projectData);
  }

  /**
   * Met à jour un projet
   */
  updateProject(projectId: string, projectData: Partial<CreateProjectRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${projectId}`, projectData);
  }

  /**
   * Supprime un projet
   */
  deleteProject(projectId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${projectId}`);
  }

  /**
   * Met à jour le statut d'un projet
   */
  updateProjectStatus(projectId: string, status: ProjectStatus): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${projectId}/status`, { status });
  }

  /**
   * Recherche les projets
   */
  searchProjects(query: string, page: number = 1, limit: number = 10): Observable<ProjectListResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProjectListResponse>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Récupère les projets de l'utilisateur connecté selon son rôle
   */
  getMyProjects(
    page: number = 1,
    limit: number = 10,
    status?: ProjectStatus,
    category?: string,
    skill?: string
  ): Observable<ProjectListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (skill) {
      params = params.set('skill', skill);
    }

    return this.http.get<ProjectListResponse>(`${this.apiUrl}/my`, { params });
  }
}
