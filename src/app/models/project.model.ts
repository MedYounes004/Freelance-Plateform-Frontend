/**
 * Modèles pour les projets et propositions
 * Alignés avec le backend Flask/MongoDB
 */

// Statut des projets
export type ProjectStatus = 'pending' | 'in-progress' | 'completed';

// Statut des propositions
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

// Statut des jalons
export type MilestoneStatus = 'pending' | 'in-progress' | 'completed';

// Modèle utilisé dans les formulaires de création de projet
export interface MilestoneForm {
  title: string;
  payment: number;
  status: MilestoneStatus;
}

/**
 * Interface pour un jalon (milestone)
 */
export interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  payment: number;
}

/**
 * Interface pour une pièce jointe
 */
export interface Attachment {
  name: string;
  size: string;
  url?: string;
}

/**
 * Interface pour un projet
 */
export interface Project {
  id: string;
  title: string;
  client: string;
  clientId: string;
  clientAvatar: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  progress: number;
  category: string;
  duration: string;
  proposalsCount: number;
  createdAt: string;
  updatedAt: string;
  description: string[];
  skills: string[];
  attachments: Attachment[];
  milestones: Milestone[];
}

/**
 * Interface pour créer/mettre à jour un projet
 */
export interface CreateProjectRequest {
  title: string;
  client: string;
  clientAvatar?: string;
  status?: ProjectStatus;
  budget: number;
  deadline: string;
  progress?: number;
  category: string;
  duration?: string;
  description?: string[];
  skills?: string[];
  attachments?: Attachment[];
  milestones?: Milestone[];
}

/**
 * Interface pour la réponse de création de projet
 */
export interface CreateProjectResponse {
  message: string;
  project: Project;
}

/**
 * Interface pour la liste des projets avec pagination
 */
export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

/**
 * Interface pour une proposition
 */
export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  deliveryTime: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour créer/mettre à jour une proposition
 */
export interface CreateProposalRequest {
  projectId: string;
  coverLetter: string;
  bidAmount: number;
  deliveryTime: string;
}

/**
 * Interface pour la réponse de création de proposition
 */
export interface CreateProposalResponse {
  message: string;
  proposal: Proposal;
}

/**
 * Interface pour la liste des propositions avec pagination
 */
export interface ProposalListResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}
