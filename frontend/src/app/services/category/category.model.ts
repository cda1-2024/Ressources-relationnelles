
export interface CategoryListResponse {
  categories: CategoryResponse[];
  pageNumber: number;
  pageSize: number;
  totalNumberCategories: number;
  totalPages: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  iconPath: string;
  color: string;
}
