import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ROLE_OPTIONS } from '../../../utils/user.util';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CategoryResponse } from '../../../services/category/category.model';
import { CategoryService } from '../../../services/category/category.service';
import { FilterRequest } from '../../../services/category/category.request';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'icon', 'color'];
  dataSource = new MatTableDataSource<CategoryResponse>([]);
  filterForm: FormGroup;
  roleOptions = ROLE_OPTIONS;
  private destroy$ = new Subject<void>();

  categories: CategoryResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        switchMap((filters) => {
          const params: FilterRequest = {
            name: filters.name,
            page: 1,
            pageSize: 50,
          };
          return this.categoryService.getFilterCategories(params);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.dataSource.data = res.categories;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
