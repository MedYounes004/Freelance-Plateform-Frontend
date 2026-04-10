import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',  // ✅ première page au lancement
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'cv-management',
    loadComponent: () =>
      import('./pages/cv-management/cv-management.page').then(m => m.CvManagementPage),
  },
  {
    path: 'upgrade',
    loadComponent: () =>
      import('./pages/pricing/pricing.page').then(m => m.PricingPage),
  },
  {
    path: 'subscription-success',
    loadComponent: () =>
      import('./pages/subscription-success/subscription-success.page').then(m => m.SubscriptionSuccessPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  }, 
  {
    path: 'messages',
    loadComponent: () => import('./pages/message-list/message-list.page').then( m => m.MessagesListPage)
  },
  {
    path: 'message-recipients',
    loadComponent: () => import('./pages/message-recipients/message-recipients.page').then( m => m.MessageRecipientsPage)
  },
  {
    path: 'messaging',
    loadComponent: () => import('./pages/messaging-screen/messaging-screen.page').then( m => m.MessagingPage)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects-screen/projects-screen.page').then( m => m.ProjectsPage)
  },
  {
    path: 'project-details',
    loadComponent: () => import('./pages/project-details-screen/project-details-screen.page').then( m => m.ProjectDetailsPage)
  },
  {
    path: 'projects/new',
    loadComponent: () => import('./pages/create-project-screen/create-project-screen.page').then( m => m.CreateProjectPage)
  },
  {
    path: 'proposals/new',
    loadComponent: () => import('./pages/create-proposal-screen/create-proposal-screen.page').then( m => m.CreateProposalPage)
  },
  
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },



  
];

