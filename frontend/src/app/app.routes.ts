import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { CreationRessourcePageComponent } from './pages/creation-ressource-page/creation-ressource-page.component';
import { MySpaceAdminPageComponent } from './pages/my-space-admin-page/my-space-admin-page.component';
import { MySpaceUserPageComponent } from './pages/my-space-user-page/my-space-user-page.component';
import { RessourceSearchPageComponent } from './pages/ressource-search-page/ressource-search-page.component';

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'presentation', component: PresentationPageComponent },
  { path: 'accueil', component: HomeComponent },
  { path: 'monEspace', component: MySpaceAdminPageComponent },
  { path: 'profil', component: ProfilPageComponent },
  { path: 'ressources/create', component: CreationRessourcePageComponent },
  { path: 'events', component: MySpaceUserPageComponent },
  { path: 'ressources', component: RessourceSearchPageComponent}
];
