export interface UserListResponse {
  users: UserResponse[];
  pageNumber: number;
  pageSize: number;
  totalNumberUsers: number;
  totalPages: number;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  bio: string;
  banned: boolean;
  disabled: boolean;
  role: number;
  ressourcesCount: number;
  eventsCount: number;
}

export interface Comment {
  message: string;
  createdAd: Date;
  author: string;
  comments: Comment[];
  ressourceId: string;
}

export interface Ressource {
  id: string;
  title: string;
  contentText: string;
  contentLink: string;
  ressourceType: string;
  visibility: string;
  status: string;
  like: number;
  createdAt: Date;
  category?: string;
}
