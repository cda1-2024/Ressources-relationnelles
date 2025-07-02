import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Ressourceservice } from '../../../services/ressource/ressource.service';
import { BreakpointService } from '../../../services/breackpoint.service';
import { CategoryService } from '../../../services/category/category.service';
import { SuccessDialogComponent } from '../../../components/alert/success-dialog.component';
import { CategoryResponse } from '../../../services/category/category.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-ressource',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    QuillModule,
  ],
  templateUrl: './update-ressource-page.component.html',
  styleUrls: ['./update-ressource-page.component.scss'],
})
export class UpdateRessourcePageComponent implements OnInit {
  ressourceForm!: FormGroup;
  isMobile = false;
  categories: CategoryResponse[] = [];
  apiErrors: { [key: string]: string[] } = {};
  selectedType: number | null = null;
  ressourceId!: string;
  imagePreviewUrl: string | null = null;
  youtubeEmbedUrl: SafeResourceUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ressourceService: Ressourceservice,
    private breakpointService: BreakpointService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.isMobile = this.breakpointService.isMobile();
    this.breakpointService.isMobile$.subscribe((val) => (this.isMobile = val));
  }

  ngOnInit(): void {
    this.ressourceId = this.route.snapshot.paramMap.get('id') ?? '';

    this.ressourceForm = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      categorie: [null, Validators.required],
      fileUpload: [null],
      content_link: [''],
      visibilite: [null, Validators.required],
    });

    this.categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.categories),
    });

    this.ressourceService.getRessourceById(this.ressourceId).subscribe({
      next: (res) => {
        this.ressourceForm.patchValue({
          titre: res.title,
          type: res.type?.id.toString(),
          contenu: res.content_text,
          categorie: res.category?.id,
          content_link: res.content_link,
          visibilite: res.visibility.id.toString(),
        });

        this.selectedType = +res.type?.id;
        if (this.selectedType === 0 && res) {
          this.imagePreviewUrl = environment.urlMedia + res.content_link;
        }

        if (this.selectedType === 3 && res.content_link) {
          this.youtubeEmbedUrl = this.getYouTubeEmbedUrl(res.content_link);
        }
        this.updateValidators();
      },
    });

    this.ressourceForm.get('type')?.valueChanges.subscribe((type) => {
      this.selectedType = +type;
      this.updateValidators();
    });
  }

  updateValidators() {
    const linkControl = this.ressourceForm.get('content_link');
    const fileControl = this.ressourceForm.get('fileUpload');

    this.apiErrors['fileUpload'] = [];

    if (this.selectedType === 0) {
      linkControl?.clearValidators();
    } else if (this.selectedType === 3) {
      fileControl?.clearValidators();
      linkControl?.setValidators([
        Validators.required,
        Validators.pattern(
          /^(https:\/\/www\.youtube\.com\/watch\?v=)[\w-]+(&\S*)?$/
        ),
      ]);
    } else {
      fileControl?.clearValidators();
      linkControl?.clearValidators();
    }

    fileControl?.updateValueAndValidity();
    linkControl?.updateValueAndValidity();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        this.apiErrors['fileUpload'] = ['Le fichier doit être être une image'];
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
      this.ressourceForm.patchValue({ fileUpload: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  updateYoutubePreview() {
    const link = this.ressourceForm.get('content_link')?.value;
    this.youtubeEmbedUrl = this.getYouTubeEmbedUrl(link);
  }

  getSafeYoutubeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('/watch?v=', '/embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  onSubmit() {
    this.apiErrors = {};
    if (this.ressourceForm.invalid) return;

    const formValue = this.ressourceForm.value;
    const contenuLength = formValue.contenu
      ? new Blob([formValue.contenu]).size
      : 0;

    if (contenuLength > 10000) {
      this.apiErrors['contenu'] = [
        'La taille du contenu ne doit pas dépasser 10 000 octets.',
      ];
      return;
    }

    const formData = new FormData();
    formData.append('title', formValue.titre);
    formData.append('category', formValue.categorie);
    formData.append('visibility', formValue.visibilite);
    formData.append('content_text', formValue.contenu);

    if (this.selectedType === 0 && formValue.fileUpload) {
      formData.append('file', formValue.fileUpload);
    }

    if (this.selectedType === 3 && formValue.content_link) {
      formData.append('content_link', formValue.content_link);
    }

    this.ressourceService
      .updateRessource(this.ressourceId, formData)
      .subscribe({
        next: () => {
          this.openSuccessDialog();
        },
        error: (err) => {
          if (err?.error?.message) {
            this.apiErrors = err.error.message;
          }
        },
      });
  }
  openSuccessDialog() {
    const message = 'Ressource modifié avec succès !';
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/events']).then(() => {
        window.location.reload();
      });
    });
  }

  getYouTubeEmbedUrl(content_link: string): SafeResourceUrl {
    if (!content_link) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    const url = content_link;
    let embedUrl = '';

    // Convertir les URLs YouTube en URLs d'embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
      embedUrl = url;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
