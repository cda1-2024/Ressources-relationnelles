import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';

export const routes: Routes = [
  { path: '', component: PresentationPageComponent },
  { path: 'presentation', component: HomeComponent },
];