import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ressource-search-page',
  imports: [
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './ressource-search-page.component.html',
  styleUrl: './ressource-search-page.component.scss',
})
export class RessourceSearchPageComponent {

   openLoginDialog(): void {
      console.log('Login button clicked');
    }
}
