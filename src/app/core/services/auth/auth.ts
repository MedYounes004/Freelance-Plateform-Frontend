import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://127.0.0.1:5000';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/api/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${API_URL}/api/auth/register`, { name, email, password, role }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  updateProfile(data: { name?: string; role?: string; bio?: string; password?: string }): Observable<any> {
    return this.http.put(`${API_URL}/api/auth/update`, data, {
      headers: this.getHeaders()
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}