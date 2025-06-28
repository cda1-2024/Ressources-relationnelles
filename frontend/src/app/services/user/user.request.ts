export interface filterRequest {
    username?: string;
    disabled?: boolean;
    role?: number;
    banned?: boolean;
    page: number;
    pageSize: number;
}