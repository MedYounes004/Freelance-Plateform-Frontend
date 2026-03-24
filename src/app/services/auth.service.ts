import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  user_type: 'freelancer' | 'client';
}

export interface AuthResponse {
  message: string;
  token: string;
  user_id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly USER_EMAIL_KEY = 'user_email';
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser$: Observable<string | null>;
  private currentTokenSubject: BehaviorSubject<string | null>;
  public currentToken$: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string | null>(
      this.getUserIdFromStorage()
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    this.currentTokenSubject = new BehaviorSubject<string | null>(
      this.getTokenFromStorage()
    );
    this.currentToken$ = this.currentTokenSubject.asObservable();
  }

  /**
   * Enregistre un nouvel utilisateur
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token, response.user_id, response.email, response.name);
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  /**
   * Connecte un utilisateur
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token, response.user_id, response.email, response.name);
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  /**
   * Retourne le token JWT courant
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retourne le token depuis le storage
   */
  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retourne l'ID utilisateur depuis le storage
   */
  private getUserIdFromStorage(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  /**
   * Stocke le token JWT et les informations utilisateur
   */
  setToken(token: string, userId: string, email: string, name: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_ID_KEY, userId);
    localStorage.setItem(this.USER_EMAIL_KEY, email);
    localStorage.setItem(this.USER_NAME_KEY, name);
    this.currentTokenSubject.next(token);
    this.currentUserSubject.next(userId);
  }

  /**
   * Supprime le token JWT et les données utilisateur
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    this.currentTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère l'ID utilisateur courant
   */
  getCurrentUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  /**
   * Récupère le nom d'utilisateur courant
   */
  getCurrentUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  /**
   * Récupère l'email d'utilisateur courant
   */
  getCurrentUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  /**
   * Vérifie si le token est expiré
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = this.decodeToken(token);
      if (!decoded.exp) return false;
      
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      return true;
    }
  }

  /**
   * Décode un token JWT (sans vérification de signature)
   */
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token');
      }

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (error) {
      throw new Error('Could not decode token');
    }
  }

  /**
   * Récupère les informations décodées du token
   */
  getTokenInfo(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.decodeToken(token);
    } catch (error) {
      return null;
    }
  }
}
