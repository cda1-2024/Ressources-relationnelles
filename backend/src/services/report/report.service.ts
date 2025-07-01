import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { UserReport } from 'src/models/userReport.model';
import { ReportUserRequestDto } from 'src/dto/report/request/report-request.dto';
import { ReportReasonFromInt } from 'src/helper/enum-mapper';
import { User } from 'src/models/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class ReportService {
  private readonly userReportsRepository: Repository<UserReport>;

  constructor(
    @InjectRepository(UserReport) userReportsRepository: Repository<UserReport>,
    private userService: UserService,
  ) {
    this.userReportsRepository = createLoggedRepository(userReportsRepository);
  }

  async findReportsByReportedId(id: string): Promise<UserReport[]> {
    try {
      const userReports = await this.userReportsRepository.find({
        relations: {
          reportedUser: true,
          reporter: true,
          reportedComment: true,
        },
        where: {
          reportedUser: { id: id },
        },
      });
      return userReports;
    } catch (error) {
      throw new BusinessException('Une erreur dans la recherche des signalements', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async reportUser(currentUser: User, userId: string, data: ReportUserRequestDto) {
    try {
      const user = await this.userService.findUserById(userId);
      const userReport = new UserReport();
      userReport.reporter = currentUser;
      userReport.reportedUser = user;
      userReport.reportReason = ReportReasonFromInt[data.reportReason];
      userReport.content = data.content;

      await this.userReportsRepository.save(userReport);
    } catch (error) {
      throw new BusinessException(
        "Une erreur est survenue lors du signalement de l'utilisateur",
        getErrorStatusCode(error),
        {
          cause: error,
        },
      );
    }
  }
}
