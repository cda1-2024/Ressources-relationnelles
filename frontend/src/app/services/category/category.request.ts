export interface FilterRequest {
	name?: string;
	page: number;
	pageSize: number;
}

export interface CreateCategoryRequest {
	name: string;
	icon: string;
	color: string;
}