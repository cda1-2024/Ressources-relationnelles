export interface FilterRequest {
  username?: string;
  disabled?: boolean;
  role?: number;
  banned?: boolean;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  role: number;
  bio?: string;
}
