import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilPageComponent } from './pages/profil-page/profil-page.component';
import { CreationRessourcePageComponent } from './pages/my-space-user-page/create-ressource/create-ressource-page.component';
import { MySpaceAdminPageComponent } from './pages/my-space-admin-page/my-space-admin-page.component';
import { MySpaceUserPageComponent } from './pages/my-space-user-page/my-space-user-page.component';
import { RessourceSearchPageComponent } from './pages/ressource-search-page/ressource-search-page.component';
import { UserViewPageComponent } from './pages/user-view-page/user-view-page.component';
import { RessourceDetailPageComponent } from './pages/ressource-detail-page/ressource-detail-page.component';
import { UpdateRessourcePageComponent } from './pages/my-space-user-page/update-ressource/update-ressource-page.component';

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'presentation', component: PresentationPageComponent },
  { path: 'accueil', component: HomeComponent },
  { path: 'monEspace', component: MySpaceAdminPageComponent },
  { path: 'profil', component: ProfilPageComponent },
  { path: 'events', component: MySpaceUserPageComponent },
  { path: 'ressources', component: RessourceSearchPageComponent },
  { path: 'utilisateurs/:id', component: UserViewPageComponent },
  { path: 'ressources/:id', component: RessourceDetailPageComponent},
  { path: 'ressources/create', component: CreationRessourcePageComponent },
  {path: 'ressources/edit/:id', component: UpdateRessourcePageComponent },  
  { path: 'events', component: MySpaceUserPageComponent }
];
