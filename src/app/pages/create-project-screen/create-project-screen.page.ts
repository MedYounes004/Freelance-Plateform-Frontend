import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonFooter,
  IonButton, IonIcon, IonInput, IonTextarea,
  IonLabel, IonItem ,
  NavController, IonSpinner, IonText, IonSelect, IonSelectOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { ProjectService } from '../../core/services/projects/project.service';
import { CreateProjectRequest } from '../../models/project.model';
import { ToastController } from '@ionic/angular';

interface MilestoneForm {
  title: string;
  payment: number;
  status: 'pending' | 'in-progress' | 'completed';
}

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project-screen.page.html',
  styleUrls: ['./create-project-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonContent, IonFooter,
    IonButton, IonIcon, IonInput, IonTextarea,
    IonLabel, IonItem,
    IonSpinner, IonText, IonSelect, IonSelectOption,
  ],
})
export class CreateProjectPage implements OnInit {

  projectForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private projectService: ProjectService,
    private toastCtrl: ToastController
  ) {
    addIcons({ arrowBackOutline, addCircleOutline, removeCircleOutline });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialise le formulaire réactif
   */
  private initializeForm(): void {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      client: ['', [Validators.required, Validators.minLength(3)]],
      clientAvatar: [''],
      status: ['pending', Validators.required],
      budget: [0, [Validators.required, Validators.min(1)]],
      deadline: ['', Validators.required],
      category: ['', Validators.required],
      duration: [''],
      description: this.fb.array([], Validators.required),
      skills: this.fb.array([], Validators.required),
      milestones: this.fb.array([]),
    });
  }

  /* --- Getters --- */

  get descriptionArray(): FormArray {
    return this.projectForm.get('description') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.projectForm.get('skills') as FormArray;
  }

  get milestonesArray(): FormArray {
    return this.projectForm.get('milestones') as FormArray;
  }

  /* --- Description Methods --- */

  addDescription(): void {
    this.descriptionArray.push(this.fb.control('', Validators.required));
  }

  removeDescription(index: number): void {
    if (this.descriptionArray.length > 1) {
      this.descriptionArray.removeAt(index);
    }
  }

  /* --- Skills Methods --- */

  addSkill(): void {
    this.skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  /* --- Milestones Methods --- */

  addMilestone(): void {
    const milestoneGroup = this.fb.group({
      title: ['', Validators.required],
      payment: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required],
    });
    this.milestonesArray.push(milestoneGroup);
  }

  removeMilestone(index: number): void {
    this.milestonesArray.removeAt(index);
  }

  /* --- Form Submission --- */

  onSubmit(): void {
    // Valider le formulaire
    if (!this.projectForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Préparer les données
    const projectData: CreateProjectRequest = {
      title: this.projectForm.value.title,
      client: this.projectForm.value.client,
      clientAvatar: this.projectForm.value.clientAvatar || '',
      status: this.projectForm.value.status,
      budget: parseFloat(this.projectForm.value.budget),
      deadline: this.projectForm.value.deadline,
      category: this.projectForm.value.category,
      duration: this.projectForm.value.duration || '',
      description: this.projectForm.value.description.filter((d: string) => d.trim()),
      skills: this.projectForm.value.skills.filter((s: string) => s.trim()),
      milestones: this.projectForm.value.milestones.filter((m: any) => m.title.trim()),
    };

    // Envoyer au backend
    this.projectService.createProject(projectData).subscribe({
      next: async (response) => {
        this.isLoading = false;
        await this.presentToast('Project created successfully!', 'success');
        this.navCtrl.navigateForward('/projects');
      },
      error: async (err) => {
        this.isLoading = false;
        console.error('Error creating project:', err);
        this.errorMessage = err.error?.message || 'Failed to create project';
        await this.presentToast(this.errorMessage, 'danger');
      },
    });
  }

  onBack(): void {
    this.navCtrl.back();
  }

  /* --- Toast Helper --- */

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
