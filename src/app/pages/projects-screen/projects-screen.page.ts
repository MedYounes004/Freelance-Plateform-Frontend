import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent,
  IonButton, IonIcon, IonSearchbar,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, calendarOutline } from 'ionicons/icons';

export type ProjectStatus = 'in-progress' | 'completed' | 'pending';

export interface Project {
  id: number;
  title: string;
  client: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  progress: number;
  category: string;
}

interface FilterTab {
  label: string;
  value: ProjectStatus | 'all';
}

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
    IonButton, IonIcon, IonSearchbar,
  ],
})
export class ProjectsPage implements OnInit {

  @Output() projectClicked = new EventEmitter<Project>();

  searchQuery = '';
  activeFilter: ProjectStatus | 'all' = 'all';

  filterTabs: FilterTab[] = [
    { label: 'All',         value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed',   value: 'completed' },
    { label: 'Pending',     value: 'pending' },
  ];

  projects: Project[] = [
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      client: 'TechStart Inc.',
      status: 'in-progress',
      budget: 2000,
      deadline: 'Mar 15, 2026',
      progress: 60,
      category: 'Design',
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      client: 'Startup Co.',
      status: 'in-progress',
      budget: 3500,
      deadline: 'Mar 20, 2026',
      progress: 35,
      category: 'Design',
    },
    {
      id: 3,
      title: 'Brand Identity Package',
      client: 'Creative Agency',
      status: 'completed',
      budget: 1500,
      deadline: 'Feb 28, 2026',
      progress: 100,
      category: 'Design',
    },
    {
      id: 4,
      title: 'Landing Page Design',
      client: 'Marketing Firm',
      status: 'pending',
      budget: 800,
      deadline: 'Mar 30, 2026',
      progress: 0,
      category: 'Design',
    },
  ];

  filteredProjects: Project[] = [];

  constructor(private navCtrl: NavController) {
    addIcons({ cashOutline, calendarOutline });
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  onSearch(event: CustomEvent): void {
    this.searchQuery = (event.detail.value as string) ?? '';
    this.applyFilters();
  }

  setFilter(filter: ProjectStatus | 'all'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onProjectClick(project: Project): void {
    this.projectClicked.emit(project);
    // navigate to details screen (similar to React state change example)
    this.navCtrl.navigateForward('/project-details', { state: { project } });
  }

  onNewProject(): void {
    // this.navCtrl.navigateForward('/projects/new');
    console.log('New project');
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