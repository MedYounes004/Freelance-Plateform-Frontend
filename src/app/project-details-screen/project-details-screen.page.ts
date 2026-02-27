import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonFooter,
  IonButton, IonIcon, IonAvatar,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, ellipsisHorizontalOutline,
  cashOutline, calendarOutline, timeOutline, personOutline,
  checkmarkCircle, documentTextOutline,
} from 'ionicons/icons';

export type MilestoneStatus = 'completed' | 'in-progress' | 'pending';

export interface Milestone {
  id: number;
  title: string;
  status: MilestoneStatus;
  payment: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
  bgClass: string;
  iconClass: string;
}

interface ProjectDetail {
  title: string;
  clientName: string;
  clientAvatar: string;
  postedAt: string;
  description: string[];
  skills: string[];
  attachments: { name: string; size: string }[];
}

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details-screen.page.html',
  styleUrls: ['./project-details-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonFooter,
    IonButton, IonIcon, IonAvatar,
  ],
})
export class ProjectDetailsPage implements OnInit {

  @Output() applyClicked = new EventEmitter<void>();

  project: ProjectDetail = {
    title: 'E-commerce Website Redesign',
    clientName: 'TechStart Inc.',
    clientAvatar:
      'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTAyN3ww&ixlib=rb-4.1.0&q=80&w=400',
    postedAt: 'Posted 2 days ago',
    description: [
      "We're looking for an experienced UI/UX designer to completely redesign our e-commerce platform. The current design needs modernization and better user experience.",
      'The project includes designing the homepage, product pages, checkout flow, and user dashboard. We need someone who can deliver modern, clean designs that convert.',
    ],
    skills: ['UI/UX Design', 'Figma', 'Responsive Design', 'E-commerce', 'Prototyping'],
    attachments: [{ name: 'project-brief.pdf', size: '2.4 MB' }],
  };

  stats: StatItem[] = [
    { label: 'Budget',    value: '$2,000',       icon: 'cash-outline',     bgClass: 'bg-indigo', iconClass: 'color-indigo' },
    { label: 'Deadline',  value: 'Mar 15, 2026', icon: 'calendar-outline', bgClass: 'bg-green',  iconClass: 'color-green'  },
    { label: 'Duration',  value: '4 weeks',      icon: 'time-outline',     bgClass: 'bg-orange', iconClass: 'color-orange' },
    { label: 'Proposals', value: '12 sent',      icon: 'person-outline',   bgClass: 'bg-purple', iconClass: 'color-purple' },
  ];

  milestones: Milestone[] = [
    { id: 1, title: 'Initial Design Concepts', status: 'completed',   payment: 500 },
    { id: 2, title: 'Revisions & Refinements', status: 'in-progress', payment: 750 },
    { id: 3, title: 'Final Delivery',           status: 'pending',     payment: 750 },
  ];

  constructor(private navCtrl: NavController) {
    addIcons({
      arrowBackOutline, ellipsisHorizontalOutline,
      cashOutline, calendarOutline, timeOutline, personOutline,
      checkmarkCircle, documentTextOutline,
    });
  }

  ngOnInit(): void {}

  onBack(): void {
    this.navCtrl.back();
  }

  onApply(): void {
    this.applyClicked.emit();
    // this.navCtrl.navigateForward('/proposals/new');
  }

  // ── Milestone helpers ──────────────────────────────────

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