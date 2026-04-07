import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonFooter,
  IonButton, IonIcon, IonInput, IonLabel, IonItem,
  IonTextarea, IonSpinner, IonText, NavController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { ProposalService } from '../../services/proposal.service';
import { CreateProposalRequest } from '../../models/project.model';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal-screen.page.html',
  styleUrls: ['./create-proposal-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonContent, IonFooter,
    IonButton, IonIcon, IonInput, IonLabel, IonItem,
    IonTextarea, IonSpinner, IonText,
  ],
})
export class CreateProposalPage implements OnInit {

  proposalForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  projectId: string = '';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private proposalService: ProposalService,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {
    addIcons({ arrowBackOutline });
    this.proposalForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Get project ID from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['projectId']) {
      this.projectId = navigation.extras.state['projectId'];
    }
    this.initializeForm();
  }

  /**
   * Initialize the reactive form for proposal submission
   */
  private initializeForm(): void {
    this.proposalForm = this.fb.group({
      coverLetter: ['', [Validators.required, Validators.minLength(20)]],
      bidAmount: [0, [Validators.required, Validators.min(1)]],
      deliveryTime: ['', Validators.required],
    });
  }

  /**
   * Submit the proposal form
   */
  onSubmit(): void {
    const currentUser = this.authService.getUser();
    if (!currentUser || currentUser.role !== 'freelancer') {
      this.errorMessage = 'Only freelancer accounts can submit proposals';
      return;
    }

    if (!this.projectId) {
      this.errorMessage = 'Project ID is missing';
      return;
    }

    if (this.proposalForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Prepare data
    const proposalData: CreateProposalRequest = {
      projectId: this.projectId,
      coverLetter: this.proposalForm.value.coverLetter.trim(),
      bidAmount: parseFloat(this.proposalForm.value.bidAmount),
      deliveryTime: this.proposalForm.value.deliveryTime.trim(),
    };

    // Submit to backend
    this.proposalService.createProposal(proposalData).subscribe({
      next: async (response) => {
        this.isLoading = false;
        await this.presentToast('Proposal submitted successfully!', 'success');
        this.navCtrl.navigateForward('/projects');
      },
      error: async (err) => {
        this.isLoading = false;
        console.error('Error creating proposal:', err);
        this.errorMessage = err.error?.message || 'Failed to submit proposal';
        await this.presentToast(this.errorMessage, 'danger');
      },
    });
  }

  onBack(): void {
    this.navCtrl.back();
  }

  /**
   * Show toast notification
   */
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
