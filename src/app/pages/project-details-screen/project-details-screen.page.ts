import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonFooter,
  IonButton, IonIcon, IonAvatar,
  NavController, IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, ellipsisHorizontalOutline,
  cashOutline, calendarOutline, timeOutline, personOutline,
  checkmarkCircle, documentTextOutline,
} from 'ionicons/icons';
import { ProjectService } from '../../core/services/projects/project.service';
import { Project, MilestoneStatus, Proposal } from '../../models/project.model';
import { ProposalService } from '../../core/services/proposal/proposal.service';
import { AuthService } from '../../core/services/auth/auth';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details-screen.page.html',
  styleUrls: ['./project-details-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonFooter,
    IonButton, IonIcon, IonAvatar, IonSpinner, IonText,
  ],
})
export class ProjectDetailsPage implements OnInit {
 // Communication avec le parent
  @Output() applyClicked = new EventEmitter<void>();

  selectedProject?: Project;
  isLoading = false;
  errorMessage = '';
  currentUserRole: 'client' | 'freelancer' | null = null;
  proposals: Proposal[] = [];
  isLoadingProposals = false;
  proposalsErrorMessage = '';
  showProposals = false;
  // Statistiques affichées (budget, deadline…)
  stats: Array<{ label: string; value: string; icon: string; bgClass: string; iconClass: string }> = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private projectService: ProjectService,
    private proposalService: ProposalService,
    private authService: AuthService
  ) {
    addIcons({
      arrowBackOutline, ellipsisHorizontalOutline,
      cashOutline, calendarOutline, timeOutline, personOutline,
      checkmarkCircle, documentTextOutline,
    });
  }

  ngOnInit(): void {
    this.currentUserRole = this.normalizeRole(this.authService.getUser()?.role || null);
     //  Charger les détails du projet au démarrage
    this.loadProjectDetails();
  }

  get isClient(): boolean {
    return this.currentUserRole === 'client';
  }

  get isFreelancer(): boolean {
    return this.currentUserRole === 'freelancer';
  }

  private normalizeRole(role: string | null): 'client' | 'freelancer' | null {
    const value = (role || '').toLowerCase();

    if (value === 'hire') {
      return 'client';
    }

    if (value === 'work') {
      return 'freelancer';
    }

    if (value === 'client' || value === 'freelancer') {
      return value;
    }

    return null;
  }

  get canViewProposals(): boolean {
    const currentUserId = this.authService.getUser()?.id;
    return this.isClient && !!this.selectedProject && !!currentUserId && this.selectedProject.clientId === currentUserId;
  }

  /**
   * Charge les détails du projet
   */
  private loadProjectDetails(): void {
 //  Récupérer l’ID du projet depuis la navigation
//  Appeler le backend pour afficher les détails    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['project']) {
      const projectId = navigation.extras.state['project'].id;
      
      this.isLoading = true;
      this.projectService.getProject(projectId).subscribe({
        next: (project) => { // Projet sélectionné (détails)
          this.selectedProject = project;
          this.updateStats();
          this.isLoading = false;
        },
        error: (err) => { // Gestion du loading et des erreurs
          console.error('Error loading project:', err);
          this.errorMessage = 'Failed to load project details';
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Met à jour les statistiques du projet
   */
  private updateStats(): void {
     // Construire les statistiques à afficher (budget, deadline, etc.)
    if (!this.selectedProject) return;

    this.stats = [
      {
        label: 'Budget',
        value: `$${this.selectedProject.budget}`,
        icon: 'cash-outline',
        bgClass: 'bg-indigo',
        iconClass: 'color-indigo',
      },
      {
        label: 'Deadline',
        value: this.selectedProject.deadline,
        icon: 'calendar-outline',
        bgClass: 'bg-green',
        iconClass: 'color-green',
      },
      {
        label: 'Duration',
        value: this.selectedProject.duration || 'Not specified',
        icon: 'time-outline',
        bgClass: 'bg-orange',
        iconClass: 'color-orange',
      },
      {
        label: 'Proposals',
        value: `${this.selectedProject.proposalsCount} sent`,
        icon: 'person-outline',
        bgClass: 'bg-purple',
        iconClass: 'color-purple',
      },
    ];
  }

  onBack(): void {
     //  Retour à la page précédente
    this.navCtrl.back();
  }

  onApply(): void {
    // Envoyer événement au parent
    //  Naviguer vers page de proposition
    this.applyClicked.emit();
    if (this.selectedProject) {
      this.navCtrl.navigateForward('/proposals/new', { state: { projectId: this.selectedProject.id } });
    }
  }

  onViewProposals(): void {
    if (!this.selectedProject) return;

    if (!this.canViewProposals) {
      this.proposalsErrorMessage = 'You can only view proposals for your own projects';
      this.showProposals = true;
      return;
    }

    this.showProposals = true;
    this.loadProposalsForProject(this.selectedProject.id);
  }

  private loadProposalsForProject(projectId: string): void {
    this.isLoadingProposals = true;
    this.proposalsErrorMessage = '';

    this.proposalService.getProposals(projectId).subscribe({
      next: (response) => {
        this.proposals = response.proposals || [];
        this.isLoadingProposals = false;
      },
      error: (err) => {
        console.error('Error loading proposals:', err);
        if (err.status === 403) {
          this.proposalsErrorMessage = 'Access denied. You can only view proposals for your own projects';
        } else if (err.status === 401) {
          this.proposalsErrorMessage = 'Session expired. Please log in again';
        } else {
          this.proposalsErrorMessage = 'Failed to load proposals for this project';
        }
        this.isLoadingProposals = false;
      },
    });
  }

  getProposalStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-pending',
      accepted: 'badge-completed',
      rejected: 'badge-rejected',
      withdrawn: 'badge-withdrawn',
    };

    return map[status] || 'badge-pending';
  }

  getProposalStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    };

    return map[status] || status;
  }

  /* Milestone helpers */

  getMilestoneIconClass(status: MilestoneStatus): string {
    const map: Record<MilestoneStatus, string> = {
      'completed':   'ms-icon-completed',
      'in-progress': 'ms-icon-progress',
      'pending':     'ms-icon-pending',
    };
    return map[status];
  }

  getMilestoneNumberClass(status: MilestoneStatus): string {
    return status === 'in-progress' ? 'color-indigo' : 'color-gray';
  }

  getMilestoneStatusClass(status: MilestoneStatus): string {
    const map: Record<MilestoneStatus, string> = {
      'completed':   'badge-completed',
      'in-progress': 'badge-in-progress',
      'pending':     'badge-pending',
    };
    return map[status];
  }

  getMilestoneStatusLabel(status: MilestoneStatus): string {
    const map: Record<MilestoneStatus, string> = {
      'completed':   'Completed',
      'in-progress': 'In Progress',
      'pending':     'Pending',
    };
    return map[status];
  }
}