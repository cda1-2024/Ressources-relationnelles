export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

//provisoire

export interface User {
  id: string;
  username: string;
  email: string;
}