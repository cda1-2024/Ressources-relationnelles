import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointService } from '../../services/breackpoint.service';
import { UserService } from '../../services/user/user.service';
import { UserResponse } from '../../services/user/user.model';

@Component({
  selector: 'app-profil-page',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.scss',
})
export class ProfilPageComponent implements OnInit {
  edit: boolean = false;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isMobile: boolean = false;
  user?: UserResponse;

  constructor(
    private userService: UserService,
    private breakpointService: BreakpointService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.profileForm = this.fb.group({
      username: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.pattern(/^(?!^\d+$)(?!^[\W]+$)[a-zA-Z0-9._-]{3,}$/),
        ],
      ],
      bio: [{ value: '', disabled: true }, Validators.maxLength(1000)],
    });

    this.passwordForm = this.fb.group({
      oldPassword: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      password: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      confirmPassword: [
        { value: '', disabled: true },
        [Validators.required, this.validateSamePassword],
      ],
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;

        this.profileForm.patchValue({
          username: this.user.username,
          bio: this.user.bio,
        });
      },
      error: (err) => {
        console.error('Erreur récupération user :', err);
      },
    });
  }

  private validateSamePassword(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    console.log(password?.value, confirmPassword?.value);
    return password?.value == confirmPassword?.value ? null : { notSame: true };
  }

  editProfile() {
    this.edit = !this.edit;
    if (this.edit) {
      this.profileForm.enable();
      this.passwordForm.enable();
    } else {
      this.profileForm.disable();
      this.passwordForm.disable();
      this.profileForm.patchValue({
        username: this.user?.username,
        bio: this.user?.bio,
      });
      this.passwordForm.reset();
      this.hideOldPassword = true;
      this.hideNewPassword = true;
      this.hideConfirmPassword = true;
    }
  }

  onSubmitProfil() {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.getRawValue();
      if (
        formValues.username === this.user?.username &&
        formValues.bio === this.user?.bio
      ) {
        return;
      }

      const payload: any = {};
      if (formValues.username !== this.user?.username) {
        payload.username = formValues.username;
      }
      if (formValues.bio !== this.user?.bio) {
        payload.bio = formValues.bio;
      }

      this.userService.updateProfile(payload.username, payload.bio).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.profileForm.patchValue({
            username: this.user.username,
            bio: this.user.bio,
          });
          this.editProfile();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du profil :', err);
        },
      });
    }
  }

  onSubmitPassword() {
    console.log('Form submitted:', this.passwordForm.value);
    if (this.passwordForm.valid) {
      console.log('Form is valid, updating profile...');
      this.userService
        .updatePassword(
          this.passwordForm.value.oldPassword,
          this.passwordForm.value.password
        )
        .subscribe({
          next: () => {
            this.editProfile();
          },
          error: (err) => {
            console.error(
              'Erreur lors de la mise à jour du mot de passe :',
              err
            );
          },
        });
    }
  }

  confirmDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.userService.deleteUser(this.user?.id || '').subscribe({
          next: () => {
            window.location.href = '/';
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du profil :', err);
          },
        });
      }
    });
  }
}

@Component({
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  selector: 'app-delete-dialog',
  template: `
    <h1 mat-dialog-title>Supprimer le profil</h1>
    <div mat-dialog-content>
      Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est
      irréversible.
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Supprimer</button>
    </div>
  `,
})
export class DeleteDialogComponent {}
