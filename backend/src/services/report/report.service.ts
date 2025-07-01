import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { UserReport } from 'src/models/userReport.model';

@Injectable()
export class ReportService {
  private readonly userReportsRepository: Repository<UserReport>;

  constructor(@InjectRepository(UserReport) userReportsRepository: Repository<UserReport>) {
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
}
