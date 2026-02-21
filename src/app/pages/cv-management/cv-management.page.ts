import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonBackButton, IonButtons, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUpload, documentText, download, trash, checkmarkCircle
} from 'ionicons/icons';

interface CV {
  id: number;
  name: string;
  size: string;
  uploadDate: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-cv-management',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonBackButton, IonButtons, IonBadge
  ],
  templateUrl: './cv-management.page.html',
  styleUrls: ['./cv-management.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CvManagementPage {

  cvList: CV[] = [
    {
      id: 1,
      name: 'Sarah_Johnson_Resume.pdf',
      size: '1.2 MB',
      uploadDate: 'Feb 1, 2026',
      isPrimary: true,
    },
    {
      id: 2,
      name: 'Sarah_Johnson_CV_Detailed.pdf',
      size: '2.8 MB',
      uploadDate: 'Jan 15, 2026',
      isPrimary: false,
    },
  ];

  tips = [
    'Keep it concise and relevant to your target roles',
    'Highlight your key achievements and skills',
    'Use a clean, professional format',
    'Update regularly with new projects and skills',
  ];

  constructor(private navCtrl: NavController) {
    addIcons({ cloudUpload, documentText, download, trash, checkmarkCircle });
  }

  onUpload(): void {
    console.log('Upload CV triggered');
    // Integrate with file picker plugin here
  }

  onDownload(cv: CV): void {
    console.log('Downloading:', cv.name);
  }

  onSetPrimary(cv: CV): void {
    this.cvList = this.cvList.map(item => ({
      ...item,
      isPrimary: item.id === cv.id
    }));
  }

  onDelete(cv: CV): void {
    this.cvList = this.cvList.filter(item => item.id !== cv.id);
  }
}