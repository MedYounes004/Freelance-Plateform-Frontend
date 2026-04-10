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
import { AuthService } from '../../core/services/auth/auth';
import { BottomNavigationComponent } from 'src/app/components/bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects-screen.page.html',
  styleUrls: ['./projects-screen.page.scss'],
  standalone: true,
  imports: [
    BottomNavigationComponent,
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

  activeTab = 'projects';
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  filterTabs: Array<{ label: string; value: ProjectStatus | 'all' }> = [
    { label: 'All',         value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed',   value: 'completed' },
    { label: 'Pending',     value: 'pending' },
  ];

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentUserRole: 'hire' | 'work' | null = null;

  constructor(
    private navCtrl: NavController, //  Navigation entre pages
    private projectService: ProjectService,  //  Communication avec backend
    private authService: AuthService
  ) {
    addIcons({ cashOutline, calendarOutline });
  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.getUser()?.role || null;
    this.loadProjects();
  }

  get canCreateProject(): boolean {
    return this.currentUserRole === 'hire';
  }

  /**
   * Charge les projets du backend
   */
  loadProjects(): void { // Appel backend pour afficher les projets
    this.isLoading = true;
    this.errorMessage = '';

    const status = this.activeFilter !== 'all' ? this.activeFilter : undefined;

    const request$ = this.currentUserRole === 'hire'
      ? this.projectService.getMyProjects(this.currentPage, this.pageSize, status as ProjectStatus | undefined)
      : this.projectService.getProjects(this.currentPage, this.pageSize, status as ProjectStatus | undefined);

    request$.subscribe({
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

  onSearch(event: CustomEvent): void { //  Recherche des projets (backend ou reset)
    this.searchQuery = (event.detail.value as string) ?? '';

    if (this.currentUserRole === 'hire') {
      // Clients already load only their own projects; apply local filter only.
      this.applyFilters();
      return;
    }

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

  setFilter(filter: ProjectStatus | 'all'): void {  // Filtrer les projets par statut
    this.activeFilter = filter;
    this.currentPage = 1;
    this.loadProjects();
  }

  onProjectClick(project: Project): void { //  Naviguer vers la page détails + envoyer au parent
    this.projectClicked.emit(project);
    this.navCtrl.navigateForward('/project-details', { state: { project } });
  }

  onNewProject(): void { //  Naviguer vers la page création de projet
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

  private applyFilters(): void { // Filtrage local (recherche + statut)
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