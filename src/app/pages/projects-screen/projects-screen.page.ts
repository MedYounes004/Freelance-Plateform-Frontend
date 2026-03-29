import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent,
  IonButton, IonIcon, IonSearchbar,
  NavController, IonSpinner, IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, calendarOutline } from 'ionicons/icons';
import { ProjectService } from '../../core/services/projects/project.service';
import { Project, ProjectStatus } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects-screen.page.html',
  styleUrls: ['./projects-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent,
    IonButton, IonIcon, IonSearchbar, IonSpinner, IonText,
  ],
})
export class ProjectsPage implements OnInit {

  @Output() projectClicked = new EventEmitter<Project>();

  searchQuery = '';
  activeFilter: ProjectStatus | 'all' = 'all';
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;

  filterTabs: Array<{ label: string; value: ProjectStatus | 'all' }> = [
    { label: 'All',         value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed',   value: 'completed' },
    { label: 'Pending',     value: 'pending' },
  ];

  projects: Project[] = [];
  filteredProjects: Project[] = [];

  constructor(
    private navCtrl: NavController,
    private projectService: ProjectService
  ) {
    addIcons({ cashOutline, calendarOutline });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  /**
   * Charge les projets du backend
   */
  loadProjects(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const status = this.activeFilter !== 'all' ? this.activeFilter : undefined;

    this.projectService
      .getProjects(this.currentPage, this.pageSize, status as ProjectStatus | undefined)
      .subscribe({
        next: (response) => {
          this.projects = response.projects || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.errorMessage = 'Failed to load projects. Please try again.';
          this.isLoading = false;
        },
      });
  }

  onSearch(event: CustomEvent): void {
    this.searchQuery = (event.detail.value as string) ?? '';

    // Si la recherche est vide, recharger depuis le backend
    if (!this.searchQuery.trim()) {
      this.currentPage = 1;
      this.loadProjects();
    } else {
      // Sinon, utiliser la recherche du backend
      this.isLoading = true;
      this.projectService
        .searchProjects(this.searchQuery, this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.projects = response.projects || [];
            this.applyFilters();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error searching projects:', err);
            this.errorMessage = 'Failed to search projects.';
            this.isLoading = false;
          },
        });
    }
  }

  setFilter(filter: ProjectStatus | 'all'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.loadProjects();
  }

  onProjectClick(project: Project): void {
    this.projectClicked.emit(project);
    this.navCtrl.navigateForward('/project-details', { state: { project } });
  }

  onNewProject(): void {
    this.navCtrl.navigateForward('/projects/new');
  }

  getStatusLabel(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      'in-progress': 'In Progress',
      'completed':   'Completed',
      'pending':     'Pending',
    };
    return map[status];
  }

  getStatusClass(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      'in-progress': 'badge-in-progress',
      'completed':   'badge-completed',
      'pending':     'badge-pending',
    };
    return map[status];
  }

  private applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredProjects = this.projects.filter((p) => {
      const matchesFilter = this.activeFilter === 'all' || p.status === this.activeFilter;
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }
}