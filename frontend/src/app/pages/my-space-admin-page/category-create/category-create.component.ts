import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BreakpointService } from '../../../services/breackpoint.service';
import { CategoryService } from '../../../services/category/category.service';
import { CreateCategoryRequest } from '../../../services/category/category.request';

@Component({
  selector: 'app-category-create',
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
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  isMobile = false;

  constructor(
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      icon: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  get name(): AbstractControl | null {
    return this.form.get('name');
  }

  get icon(): AbstractControl | null {
    return this.form.get('icon');
  }

  get color(): AbstractControl | null {
    return this.form.get('color');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const categoryData: CreateCategoryRequest = {
      name: this.name?.value,
      icon: this.icon?.value,
      color: this.color?.value,
    };
    this.categoryService.createCategory(categoryData).subscribe({
      next: (response) => {
        this.loading = false;
        this.errorMessage = 'Catégorie créée avec succès !';
        this.form.reset();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors de la création de la catégorie.';
      }
    });
  }

}
