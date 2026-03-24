import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Proposal,
  CreateProposalRequest,
  CreateProposalResponse,
  ProposalListResponse,
  ProposalStatus
} from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = `${environment.apiUrl}/proposals`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les propositions pour un projet
   */
  getProposals(projectId: string, page: number = 1, limit: number = 10): Observable<ProposalListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ProposalListResponse>(`${this.apiUrl}/${projectId}`, { params });
  }

  /**
   * Récupère une proposition par ID
   */
  getProposal(proposalId: string): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.apiUrl}/${proposalId}`);
  }

  /**
   * Crée une nouvelle proposition
   */
  createProposal(proposalData: CreateProposalRequest): Observable<CreateProposalResponse> {
    return this.http.post<CreateProposalResponse>(this.apiUrl, proposalData);
  }

  /**
   * Met à jour une proposition
   */
  updateProposal(proposalId: string, proposalData: Partial<CreateProposalRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${proposalId}`, proposalData);
  }

  /**
   * Supprime une proposition
   */
  deleteProposal(proposalId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${proposalId}`);
  }

  /**
   * Met à jour le statut d'une proposition
   */
  updateProposalStatus(proposalId: string, status: ProposalStatus): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${proposalId}/status`, { status });
  }
}
