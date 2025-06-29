import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ROLE_OPTIONS } from '../../../utils/user.util';
import { UserService } from '../../../services/user/user.service';
import { CreateUserRequest } from '../../../services/user/user.request';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointService } from '../../../services/breackpoint.service';

@Component({
  selector: 'app-user-create',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent implements OnInit {
  form!: FormGroup;
  roleOptions = ROLE_OPTIONS;
  loading = false;
  errorMessage = '';
  isMobile = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit() {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?!^\d+$)(?!^[\W]+$)[a-zA-Z0-9._-]{3,}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required, this.validateSamePassword]],
      role: [null, [Validators.required]],
      bio: ['', [Validators.maxLength(1000)]],
    });
  }

  private validateSamePassword(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { notSame: true };
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const createUserRequest: CreateUserRequest = {
      email: this.f['email'].value,
      username: this.f['username'].value,
      password: this.f['password'].value,
      role: this.f['role'].value,
      bio: this.f['bio'].value || undefined,
    };

    this.userService.createUser(createUserRequest).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.errorMessage = 'Utilisateur créé avec succès';
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.message || 'Une erreur est survenue';
      }
    });
  }
}
