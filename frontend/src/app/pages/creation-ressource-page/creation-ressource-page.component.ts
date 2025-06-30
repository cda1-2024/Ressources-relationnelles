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
import { RessourceService } from '../../services/ressource/ressource.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RessourceSuccessDialogComponent } from '../../components/ressource-success-dialog/ressource-success-dialog.component';

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

  constructor(
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
    private categoryService: CategoryService,
    private ressourceService: RessourceService,
    private dialog: MatDialog,
    private router: Router
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
      contenu: [''],
      categorie: ['', Validators.required],
      lien: [''],
      visibilite: ['', Validators.required],
    });

    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.categories;
      },
      error: (err) => {
        console.error('Erreur récupération catégories', err);
      },
    });
  }

  openSuccessDialog() {
    const dialogRef = this.dialog.open(RessourceSuccessDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/']); // Redirige vers page d’accueil après clic sur OK
    });
  }

  onSubmit() {
    this.apiErrors = {};
    if (this.ressourceForm.valid) {
      const formValue = this.ressourceForm.value;

      const payload = {
        title: formValue.titre,
        category: formValue.categorie,
        type: +formValue.type,
        visibility: +formValue.visibilite,
        content_text: formValue.contenu,
        content_link: formValue.lien || undefined,
      };

      this.ressourceService.createRessource(payload).subscribe({
        next: () => {
          this.openSuccessDialog(); // Affiche le modal si succès
          this.ressourceForm.reset(); // Vide le formulaire
        },
        error: (err) => {
          console.error('Erreur lors de la création de la ressource', err);
          if (err?.error?.message) {
            this.apiErrors = err.error.message; // stocke les erreurs liées aux champs
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
