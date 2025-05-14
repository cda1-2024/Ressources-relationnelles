export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  accessToken	: string;
}
