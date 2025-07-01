import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { QuillModule } from 'ngx-quill';
import { BreakpointService } from '../../services/breackpoint.service';
import { CategoryService } from '../../services/category/category.service';
import { CategoryResponse } from '../../services/category/category.model';
import { Ressourceservice } from '../../services/ressource/ressource.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../../components/alert/success-dialog.component';

@Component({
  selector: 'app-creation-ressource-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    QuillModule,
    MatDialogModule,
  ],
  templateUrl: './creation-ressource-page.component.html',
  styleUrls: ['./creation-ressource-page.component.scss'],
})
export class CreationRessourcePageComponent implements OnInit {
  ressourceForm!: FormGroup;
  isMobile = false;
  categories: CategoryResponse[] = [];
  apiErrors: { [key: string]: string[] } = {};
  selectedType: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly breakpointService: BreakpointService,
    private readonly categoryService: CategoryService,
    private readonly ressourceService: Ressourceservice,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  ngOnInit(): void {
    this.ressourceForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      contenu: ['', Validators.required],
      categorie: ['', Validators.required],
      fileUpload: [null],
      content_link: [''],
      visibilite: ['', Validators.required],
    });

    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.categories;
      },
      error: (err) => {
        console.error('Erreur récupération catégories', err);
      },
    });

    this.ressourceForm.get('type')?.valueChanges.subscribe((typeValue) => {
      this.selectedType = +typeValue;
      this.updateValidators();
    });
  }

  updateValidators() {
    const lienControl = this.ressourceForm.get('lien');
    const fileControl = this.ressourceForm.get('fileUpload');

    // Reset erreurs
    this.apiErrors['fileUpload'] = [];

    if (this.selectedType === 0) {
      // Image
      lienControl?.clearValidators();
      lienControl?.updateValueAndValidity();

      fileControl?.setValidators([Validators.required]);
      fileControl?.updateValueAndValidity();
    } else if (this.selectedType === 3) {
      // Vidéo (YouTube)
      fileControl?.clearValidators();
      fileControl?.updateValueAndValidity();

      lienControl?.setValidators([
        Validators.required,
        Validators.pattern(
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
        ),
      ]);
      lienControl?.updateValueAndValidity();
    } else {
      lienControl?.clearValidators();
      lienControl?.updateValueAndValidity();
      fileControl?.clearValidators();
      fileControl?.updateValueAndValidity();
    }
  }

  openSuccessDialog() {
    const message = 'Ressource créée avec succès !';
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10 Mo

      if (!validTypes.includes(file.type)) {
        this.apiErrors['fileUpload'] = [
          'Le fichier doit être une image PNG ou JPEG.',
        ];
        this.ressourceForm.get('fileUpload')?.setErrors({ invalidType: true });
        return;
      }

      if (file.size > maxSize) {
        this.apiErrors['fileUpload'] = [
          'La taille de l’image ne doit pas dépasser 10 Mo.',
        ];
        this.ressourceForm.get('fileUpload')?.setErrors({ tooLarge: true });
        return;
      }

      this.apiErrors['fileUpload'] = [];
      this.ressourceForm.patchValue({
        fileUpload: file,
      });
    }
  }

  onSubmit() {
    this.apiErrors = {};
    if (this.ressourceForm.valid) {
      const formValue = this.ressourceForm.value;
      if (!formValue) {
        return;
      }

      const contenuLength = formValue.contenu
        ? new Blob([formValue.contenu]).size
        : 0;
      console.log('Taille du contenu:', contenuLength);
      if (contenuLength > 10000) {
        this.apiErrors['contenu'] = [
          'La taille du contenu ne doit pas dépasser 10 000 octets.',
        ];
        return;
      }

      const formData = new FormData();
      formData.append('title', formValue.titre);
      formData.append('category', formValue.categorie);
      formData.append('type', formValue.type);
      formData.append('visibility', formValue.visibilite);
      formData.append('content_text', formValue.contenu);

      if (this.selectedType === 0 && formValue.fileUpload) {
        formData.append('file', formValue.fileUpload);
      }

      if (this.selectedType === 3 && formValue.content_link) {
        formData.append('content_link', formValue.content_link);
      }

      this.ressourceService.createRessource(formData).subscribe({
        next: () => {
          this.openSuccessDialog();
        },
        error: (err) => {
          if (err?.error?.message) {
            this.apiErrors = err.error.message;
          }
        },
      });
    } else {
      console.warn('Formulaire invalide');
    }
  }

  saveRessource() {
    this.onSubmit();
  }
}
