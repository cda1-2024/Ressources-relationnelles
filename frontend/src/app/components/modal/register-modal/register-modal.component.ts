import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login_modal/login_modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
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
    ReactiveFormsModule
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {
  hidePsw = true;
  hideConfirmPsw = true;
  form: FormGroup;
  error: string | null = null;

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
      const password = control.parent?.get('password');
      const confirmPassword = control.parent?.get('confirmPassword');
      return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [
        Validators.required,
        Validators.pattern(/^(?!^\d+$)(?!^[\W]+$)[a-zA-Z0-9._-]{3,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required, this.validateSamePassword]],
      rememberMe: [false]
    });

  }

  ngOnInit(): void {
      // These subscriptions need to be in ngOnInit
      this.form.get('password')?.valueChanges.subscribe(() => {
        this.form.updateValueAndValidity();
      });

      this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.form.updateValueAndValidity();
      });
  }

  onSubmit() {
    if (this.form.valid) {
      // Access form values using this.form.value
      const email = this.form.value.email;
      const username = this.form.value.username;
      const password = this.form.value.password;
      const rememberMe = this.form.value.rememberMe;

      this.auth.register(email, username, password, rememberMe).subscribe({
        next: () => {
          this.dialogRef.close();
          this.error = null;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.message;
          console.error('Register failed', err);
        }
      });
    } else {
        console.log("Form is invalid")
    }
  }

  openLoginModal() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
      width: '400px'
    });
  }
}
