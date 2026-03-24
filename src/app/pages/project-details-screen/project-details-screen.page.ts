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
import { ProjectService } from '../../services/project.service';
import { Project, Milestone, MilestoneStatus } from '../../models/project.model';

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

  @Output() applyClicked = new EventEmitter<void>();

  selectedProject?: Project;
  isLoading = false;
  errorMessage = '';

  stats: Array<{ label: string; value: string; icon: string; bgClass: string; iconClass: string }> = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private projectService: ProjectService
  ) {
    addIcons({
      arrowBackOutline, ellipsisHorizontalOutline,
      cashOutline, calendarOutline, timeOutline, personOutline,
      checkmarkCircle, documentTextOutline,
    });
  }

  ngOnInit(): void {
    this.loadProjectDetails();
  }

  /**
   * Charge les détails du projet
   */
  private loadProjectDetails(): void {
    // Get the project from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['project']) {
      const projectId = navigation.extras.state['project'].id;
      
      this.isLoading = true;
      this.projectService.getProject(projectId).subscribe({
        next: (project) => {
          this.selectedProject = project;
          this.updateStats();
          this.isLoading = false;
        },
        error: (err) => {
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
    this.navCtrl.back();
  }

  onApply(): void {
    this.applyClicked.emit();
    if (this.selectedProject) {
      this.navCtrl.navigateForward('/proposals/new', { state: { projectId: this.selectedProject.id } });
    }
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