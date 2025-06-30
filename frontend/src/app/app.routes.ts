import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { CreationRessourcePageComponent } from './pages/creation-ressource-page/creation-ressource-page.component';

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'presentation', component: HomeComponent },
  { path: 'profil', component: ProfilPageComponent },
  { path: 'createRessource', component: CreationRessourcePageComponent },
];
