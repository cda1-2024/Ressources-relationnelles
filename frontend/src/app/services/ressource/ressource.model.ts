export interface RessourceListResponse {
  ressources: RessourceResponse[];
  pageNumber: number;
  pageSize: number;
  totalNumberRessources: number;
  totalPages: number;
}

export interface RessourceResponse {
  id: string;
  title: string;
  category?: string;
  content_link: string;
  content_text: string;
  created_at: string;
  creator: User;
  status: RessourceStatus;
  visibility: RessourceVisiblityDto;
  type: RessourceTypeDto;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments?: Comment[];
  validator?: User;
  admin_validation?: boolean;
  date_time_validation?: string;
  like?: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: User;
  replies?: Comment[];
  parent_comment_id?: string;
}

export interface User {
  id: string;
  username: string;
}

export interface RessourceStatus {
  id: number;
  label: string;
}

export interface RessourceVisiblityDto {
  id: number;
  label: string;
}

export interface RessourceTypeDto {
  id: number;
  label: string;
}

export interface CreateRessourceRequest {
  title: string;
  category: string;
  visibility: number;
  type: number;
  content_text: string;
  content_link?: string;
}

export interface FilterRessourceRequest {
  query?: string;
  categoryId?: string;
  type?: string;
  creatorId?: string;
  validatorId?: string;
  status?: number;
  page?: number;
  pageSize?: number;
}

export interface RessourceTypeOption {
  value: string;
  label: string;
}
