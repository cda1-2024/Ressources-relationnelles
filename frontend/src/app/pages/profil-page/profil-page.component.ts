import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointService } from '../../services/breackpoint.service';

@Component({
  selector: 'app-profil-page',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.scss',
})
export class ProfilPageComponent {
  profileForm: FormGroup;
  isMobile: boolean = false;

  constructor(private breakpointService: BreakpointService, private fb: FormBuilder, private dialog: MatDialog) {
    this.isMobile = this.breakpointService.isMobile();
      this.breakpointService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      });

    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      bio: [{ value: '', disabled: true }, Validators.maxLength(1000)],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form data:', this.profileForm.value);
      // Appel au backend pour sauvegarder
    }
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('Profil supprimé');
        // Appel au backend pour supprimer le compte
      }
    });
  }
}

@Component({
  selector: 'app-delete-dialog',
  template: `
    <h1 mat-dialog-title>Supprimer le profil</h1>
    <div mat-dialog-content>
      Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est
      irréversible.
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-button color="warn">Supprimer</button>
    </div>
  `,
})
export class DeleteDialogComponent {}
