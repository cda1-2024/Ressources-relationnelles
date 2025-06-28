import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { MySpacePageComponent } from './pages/my-space-page/my-space-page.component';

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'presentation', component: PresentationPageComponent },
  { path: 'accueil', component: HomeComponent },
  { path: 'monEspace', component: MySpacePageComponent },
  { path: 'profil', component: ProfilPageComponent },
];