import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserResponse } from '../../../services/user/user.model';
import { ROLE_OPTIONS } from '../../../utils/user.util';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user/user.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FilterRequest as FilterRequest } from '../../../services/user/user.request';

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'status', 'role'];
  dataSource = new MatTableDataSource<UserResponse>([]);
  filterForm: FormGroup;
  roleOptions = ROLE_OPTIONS;
  private destroy$ = new Subject<void>();

  users: UserResponse[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.filterForm = this.fb.group({
      username: [''],
      status: [null],
      role: [null],
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
            username: filters.username,
            banned:
              filters.status === 'banned'
                ? true
                : filters.status === 'active'
                ? false
                : undefined,
            disabled:
              filters.status === 'disabled'
                ? true
                : filters.status === 'active'
                ? false
                : undefined,
            role: filters.role,
            page: 1,
            pageSize: 50,
          };
          // Appel HTTP
          return this.userService.getFilterUsers(params);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.dataSource.data = res.users;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRoleLabel(value: number): string {
    const opt = this.roleOptions.find((o) => o.value === value);
    return opt ? opt.label : 'Inconnu';
  }
}
