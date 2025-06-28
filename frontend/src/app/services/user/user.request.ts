export interface FilterRequest {
    username?: string;
    disabled?: boolean;
    role?: number;
    banned?: boolean;
    page: number;
    pageSize: number;
}