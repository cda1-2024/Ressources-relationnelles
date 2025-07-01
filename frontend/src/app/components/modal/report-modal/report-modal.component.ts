import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { REPORT_REASON_OPTIONS } from '../../../utils/user.util';
import { MatSelectModule } from '@angular/material/select';
import { ReportService } from '../../../services/report/report.service';

@Component({
  selector: 'app-report-modal',
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
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss'
})
export class ReportModalComponent implements OnInit{
  user!: { id: string; username: string; };
  reportForm!: FormGroup;
  reportReasonOptions = REPORT_REASON_OPTIONS;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: { id: string; username: string } },
    private fb: FormBuilder,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<ReportModalComponent>,
    private dialog: MatDialog
  ) {
    this.user = data.user;
  }

  ngOnInit() {
    this.reportForm = this.fb.group({
      reportReason: [null],
      description: [''],
      agreeToTerms: [false]
    });
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.error = 'Veuillez remplir tous les champs requis.';
      return;
    }

    const reportData = {
      reportReason: this.reportForm.value.reportReason,
      content: this.reportForm.value.description
    };

    this.reportService.reportUser(this.user.id, reportData).subscribe({
      next: () => {
        this.dialogRef.close();
        window.location.reload();
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors de la soumission du signalement.';
        console.error(err);
      }
    });
  }
}
