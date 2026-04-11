import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFreelancers(): Observable<User[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users/freelancers`)
      .pipe(
        map((rows) =>
          (Array.isArray(rows) ? rows : [])
            .map((row) => this.toUser(row))
            .filter((user) => this.normalizeRole(user.role) === 'freelancer')
        )
      );
  }

  private normalizeRole(role: string): string {
    const value = (role || '').trim().toLowerCase();

    if (value === 'work') {
      return 'freelancer';
    }

    if (value === 'hire') {
      return 'client';
    }

    return value;
  }

  private toUser(row: any): User {
    return {
      id: String(row?.id || ''),
      name: String(row?.name || ''),
      email: String(row?.email || ''),
      role: String(row?.role || ''),
      subscription: String(row?.subscription || ''),
      bio: String(row?.bio || ''),
      avatar: String(row?.avatar || ''),
      createdAt: row?.createdAt ? String(row.createdAt) : undefined,
    };
  }
}
