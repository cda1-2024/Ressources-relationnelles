import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from 'src/controller/report.controller';
import { UserReport } from 'src/models/userReport.model';
import { ReportService } from 'src/services/report/report.service';
import { UserModule } from './user.module';

@Module({
  controllers: [ReportController],
  imports: [TypeOrmModule.forFeature([UserReport]), forwardRef(() => UserModule)],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
