export interface ReportResponse {
  reportedUser: User;
  reporter: User;
  content: string;
  moderatorView: string;
  isResolved: boolean;
  reportReason: ReportReason;
  reportedComment?: string;
	createdAt: string;
}

interface ReportReason {
  id: number;
  label: string;
}

interface User {
  id: string;
  username: string;
}