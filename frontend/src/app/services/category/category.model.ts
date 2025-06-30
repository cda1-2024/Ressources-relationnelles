// * ////////////////////
// *  Entity 
// * ////////////////////

export interface CategorySimple{
    id: string;
    name: string;
    iconPath: string; 
    color: string;
}

export interface Category extends CategorySimple {
    createdAt: Date;
    lastAuthor: {
        id: string;
        username: string;
    }
}

// * ////////////////////
// *  Responses 
// * ////////////////////

export interface SingleCategoryResponse extends Category {
}

export interface MultipleCategoryResponse {
    categories: CategorySimple[];
}

// * ////////////////////
// *  Requests 
// * ////////////////////

export interface CreateCategoryRequest {
    name: string;
    color: string;
    icon: string; 
}

export interface UpdateCategoryRequest {
    name?: string;
    color?: string;
    iconPath?: string; 
    deleted?: boolean;
}