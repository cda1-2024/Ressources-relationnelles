import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './login_modal.component.html',
  styleUrls: ['./login_modal.component.scss']
})
export class LoginComponent {
  hide = true;
  email = '';
  password = '';
  rememberMe = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent> // Injection du service MatDialogRef
  ) {}

  onSubmit() {
    this.auth.login(this.email, this.password, this.rememberMe).subscribe({
      next: () => {
        this.dialogRef.close();
        this.error = null;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.message;
        console.error('Login failed', err);
      }
    });
  }
}