import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth';

const API_URL = 'http://127.0.0.1:5000';

@Injectable({ providedIn: 'root' })
export class CvService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ── Get all CVs ──────────────────────────
  getCvs(): Observable<any> {
    return this.http.get(`${API_URL}/api/cv`, {
      headers: this.getHeaders()
    });
  }

  // ── Upload CV ────────────────────────────
  uploadCv(name: string, data: string, size: string): Observable<any> {
    return this.http.post(`${API_URL}/api/cv/upload`, { name, data, size }, {
      headers: this.getHeaders()
    });
  }

  // ── Set Primary ──────────────────────────
  setPrimary(cvId: string): Observable<any> {
    return this.http.put(`${API_URL}/api/cv/${cvId}/primary`, {}, {
      headers: this.getHeaders()
    });
  }

  // ── Delete CV ────────────────────────────
  deleteCv(cvId: string): Observable<any> {
    return this.http.delete(`${API_URL}/api/cv/${cvId}`, {
      headers: this.getHeaders()
    });
  }

  // ── Download CV ──────────────────────────
  downloadCv(cvId: string): Observable<any> {
    return this.http.get(`${API_URL}/api/cv/${cvId}/download`, {
      headers: this.getHeaders()
    });
  }
}