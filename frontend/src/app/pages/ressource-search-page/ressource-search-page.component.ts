import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../services/category/category.service';
import { Ressourceservice } from '../../services/ressource/ressource.service';
import { FilterRessourceRequest, RessourceResponse, RessourceTypeOption } from '../../services/ressource/ressource.model';
import { CategorySimple, MultipleCategoryResponse } from '../../services/category/category.model';
import { debounceTime, Subject } from 'rxjs';

// Constants
const SEARCH_DEBOUNCE_TIME = 300;
const DEFAULT_PAGE_SIZE = 10;
const FALLBACK_ICON = 'category';
const TODO_ICON_PLACEHOLDER = 'TODO_A_AJOUTER';

@Component({
  selector: 'app-ressource-search-page',
  imports: [
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './ressource-search-page.component.html',
  styleUrl: './ressource-search-page.component.scss',
  animations: [
    trigger('slideUp', [
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(-40px)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RessourceSearchPageComponent implements OnInit {

  // Pagination
  totalItems = 0;
  pageSize = DEFAULT_PAGE_SIZE;
  currentPage = 0;

  // Filters
  searchQuery = '';
  selectedCategory = '';
  selectedType = '';

  // Data
  categories: CategorySimple[] = [];
  articles: RessourceResponse[] = [];
  isLoading = false;

  // Configuration
  readonly ressourceTypes: RessourceTypeOption[] = [
    { value: '', label: 'Tous' },
    { value: 'texte', label: 'Texte' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Vidéo' },
    { value: 'pdf', label: 'PDF' }
  ];

  // Private
  private readonly searchSubject = new Subject<string>();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly ressourceService: Ressourceservice
  ) {
    this.initializeSearchDebounce();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.resetPaginationAndApplyFilters();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.resetPaginationAndApplyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.applyFilters();
  }

  selectCategory(categoryId: string | null): void {
    const newCategoryId = categoryId || '';
    
    // Toggle: if clicking on already selected category, deselect it
    if (this.selectedCategory === newCategoryId && categoryId !== null) {
      this.selectedCategory = '';
    } else {
      this.selectedCategory = newCategoryId;
    }
    
    this.resetPaginationAndApplyFilters();
  }

  toggleLike(article: RessourceResponse): void {
    article.isLiked = !article.isLiked;
    article.likeCount += article.isLiked ? 1 : -1;
  }

  isAllCategoriesSelected(): boolean {
    return !this.selectedCategory;
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategory === categoryId;
  }

  formatCount(count: number): string {
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 1000) + 'k';
    return count.toString();
  }

  

  trackByValue = (index: number, item: any) => item.value;
  trackByCategoryId = (index: number, category: CategorySimple) => category.id;
  trackByArticleId = (index: number, article: RessourceResponse) => article.id;


  private initializeSearchDebounce(): void {
    this.searchSubject
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME))
      .subscribe(() => this.resetPaginationAndApplyFilters());
  }

  private loadInitialData(): void {
    this.fetchCategories();
    this.applyFilters();
  }

  private resetPaginationAndApplyFilters(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  private fetchCategories(): void {
    
    this.categoryService.getAll().subscribe({
      next: (response: MultipleCategoryResponse) => {
        this.categories = this.processCategories(response.categories || []);
      },
      error: (error: any) => {
        console.error('❌ Error fetching categories:', error);
        this.categories = [];
      }
    });
  }

  private processCategories(categories: CategorySimple[]): CategorySimple[] {
    return categories.map(category => ({
      ...category,
      iconPath: category.iconPath === TODO_ICON_PLACEHOLDER ? FALLBACK_ICON : category.iconPath
    }));
  }

  private applyFilters(): void {
    this.isLoading = true;
    const filters = this.buildFilters();
    
    console.log('🔍 Applying filters:', filters);

    this.ressourceService.getFilteredPublicRessources(filters).subscribe({
      next: (response) => this.handleRessourcesSuccess(response),
      error: (error) => this.handleRessourcesError(error)
    });
  }

  private buildFilters(): FilterRessourceRequest {
    const filters: FilterRessourceRequest = {
      page: this.currentPage + 1, // API uses 1-based pagination
      pageSize: this.pageSize
    };

    if (this.searchQuery.trim()) filters.query = this.searchQuery.trim();
    if (this.selectedCategory) filters.categoryId = this.selectedCategory;
    if (this.selectedType) filters.type = this.selectedType;

    return filters;
  }

  private handleRessourcesSuccess(response: any): void {
    this.articles = Array.isArray(response.ressources) ? response.ressources : [];
    this.totalItems = response.totalNumberRessources || 0;
    this.isLoading = false;
  }

  private handleRessourcesError(error: any): void {
    console.error('❌ Error fetching ressources:', error);
    this.articles = [];
    this.totalItems = 0;
    this.isLoading = false;
  }

  
}
