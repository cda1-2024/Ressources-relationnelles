import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from 'src/controller/report.controller';
import { UserReport } from 'src/models/userReport.model';
import { ReportService } from 'src/services/report/report.service';

@Module({
  controllers: [ReportController],
  imports: [TypeOrmModule.forFeature([UserReport])],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
