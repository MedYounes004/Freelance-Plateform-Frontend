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
import { CreateProjectRequest, MilestoneForm } from '../../models/project.model';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth/auth';

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
   // Formulaire principal 
  projectForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, //  Créer le formulaire
    private navCtrl: NavController, //  Navigation
    private projectService: ProjectService,  // Backend API
    private toastCtrl: ToastController,  //  Messages utilisateur
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline, addCircleOutline, removeCircleOutline });
  }

  ngOnInit(): void {    //  Initialiser le formulaire au démarrage
    this.initializeForm();
  }

  /**
   * Initialise le formulaire réactif
   * → Définit tous les champs du projet + validations
   */
  private initializeForm(): void {
    const currentUser = this.authService.getUser();

    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      client: [currentUser?.name || '', [Validators.required, Validators.minLength(3)]],
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

    // Add one default row for required arrays so the form is usable immediately.
    this.addDescription();
    this.addSkill();
  }

  /* --- Getters --- */
 // Liste des descriptions
  get descriptionArray(): FormArray {
    return this.projectForm.get('description') as FormArray;
  }
//  Liste des skills
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
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Please log in before creating a project';
      this.presentToast(this.errorMessage, 'danger');
      this.navCtrl.navigateForward('/login');
      return;
    }

    const currentUser = this.authService.getUser();
    if (!currentUser || currentUser.role !== 'client') {
      this.errorMessage = 'Only client accounts can create projects';
      this.presentToast(this.errorMessage, 'danger');
      return;
    }

    // Valider le formulaire
    if (!this.projectForm.valid) {
      this.projectForm.markAllAsTouched();
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

        if (err.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
        } else if (err.status === 403) {
          this.errorMessage = err.error?.message || 'Only client accounts can create projects';
        } else if (err.status === 422) {
          this.errorMessage = err.error?.message || 'Invalid project data. Please check required fields.';
        } else {
          this.errorMessage = err.error?.message || 'Failed to create project';
        }

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
