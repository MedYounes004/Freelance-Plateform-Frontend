import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },

 {
  path: 'profile',
  loadComponent: () =>
    import('./pages/profile/profile.page').then(m => m.ProfilePage),
},
  {
    path: 'cv-management',
    loadComponent: () => import('./pages/cv-management/cv-management.page').then( m => m.CvManagementPage)
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


  


];
