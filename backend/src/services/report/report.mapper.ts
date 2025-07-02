import { ReportResponseDto } from 'src/dto/report/response/report-response.dto';
import { ReportReasonToInt } from 'src/helper/enum-mapper';
import { UserReport } from 'src/models/userReport.model';

export class ReportMapper {
  static toResponseDto(report: UserReport): ReportResponseDto {
    return {
      reportedUser: {
        id: report.reportedUser.id,
        username: report.reportedUser.username,
      },
      reporter: {
        id: report.reporter.id,
        username: report.reporter.username,
      },
      content: report.content,
      moderatorView: report.moderatorView,
      isResolved: report.isResolved,
      reportReason: {
        id: ReportReasonToInt[report.reportReason],
        label: report.reportReason,
      },
      createdAt: report.createdAt.toISOString(),
    };
  }

  static toResponseListDto(reports: UserReport[]): ReportResponseDto[] {
    return reports.map((report) => this.toResponseDto(report));
  }
}
