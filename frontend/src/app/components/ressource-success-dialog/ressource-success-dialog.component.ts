import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ressource-success-dialog',
  imports: [
    CommonModule,
    MatDialogModule, 
    MatButtonModule,
  ],
  templateUrl: './ressource-success-dialog.component.html',
})
export class RessourceSuccessDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RessourceSuccessDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}