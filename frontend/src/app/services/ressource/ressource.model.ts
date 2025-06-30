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
