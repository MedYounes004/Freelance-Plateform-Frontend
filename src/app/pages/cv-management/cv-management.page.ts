import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonIcon, IonBackButton, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUpload, documentText, download, trash, checkmarkCircle
} from 'ionicons/icons';
import { CvService } from '../../core/services/cv/cv.service';

interface CV {
  id: string;
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
    IonIcon, IonBackButton, IonButtons
  ],
  templateUrl: './cv-management.page.html',
  styleUrls: ['./cv-management.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CvManagementPage {

  cvList: CV[] = [];
  isLoading = false;
  errorMessage = '';

  tips = [
    'Keep it concise and relevant to your target roles',
    'Highlight your key achievements and skills',
    'Use a clean, professional format',
    'Update regularly with new projects and skills',
  ];

  constructor(
    private navCtrl: NavController,
    private cvService: CvService
  ) {
    addIcons({ cloudUpload, documentText, download, trash, checkmarkCircle });
  }

  // ── Load CVs when page opens ──────────────
  ionViewWillEnter(): void {
    this.loadCvs();
  }

  loadCvs(): void {
    this.isLoading = true;
    this.cvService.getCvs().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.cvList = res;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load CVs.';
        console.error(err);
      }
    });
  }

  // ── Upload ────────────────────────────────
  onUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File must be smaller than 5MB.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

        this.cvService.uploadCv(file.name, base64, sizeInMB).subscribe({
          next: (res: any) => {
            this.cvList.push(res);   // add to list immediately
            this.errorMessage = '';
          },
          error: (err: any) => {
            this.errorMessage = 'Upload failed. Try again.';
            console.error(err);
          }
        });
      };
      reader.readAsDataURL(file);
    };

    input.click();  // open file picker
  }

  // ── Download ──────────────────────────────
  onDownload(cv: CV): void {
    this.cvService.downloadCv(cv.id).subscribe({
      next: (res: any) => {
        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = res.data;         // base64 data
        link.download = res.name;     // file name
        link.click();
      },
      error: (err: any) => {
        this.errorMessage = 'Download failed.';
        console.error(err);
      }
    });
  }

  // ── Set Primary ───────────────────────────
  onSetPrimary(cv: CV): void {
    this.cvService.setPrimary(cv.id).subscribe({
      next: () => {
        this.cvList = this.cvList.map(item => ({
          ...item,
          isPrimary: item.id === cv.id
        }));
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to set primary.';
        console.error(err);
      }
    });
  }

  // ── Delete ────────────────────────────────
  onDelete(cv: CV): void {
    this.cvService.deleteCv(cv.id).subscribe({
      next: () => {
        this.cvList = this.cvList.filter(item => item.id !== cv.id);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to delete CV.';
        console.error(err);
      }
    });
  }
}