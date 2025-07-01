import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportResponseDto } from 'src/dto/report/response/report-response.dto';
import { ReportMapper } from 'src/services/report/report.mapper';
import { ReportService } from 'src/services/report/report.service';

@ApiTags('Reports')
@Controller('api/reports/')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/:idComment')
  @ApiQuery({ name: 'idComment', required: false, type: Number })
  reportComment(): null {
    return null;
  }

  @Get('/:id')
  @ApiOperation({
    summary: "Récupérer la liste des signalements d'un utilisateur",
    description: 'Récupérer la liste des signalements en fonction de l’ID de l’utilisateur',
  })
  @ApiOkResponse({
    description: 'Le ou les signalements ont été trouvées avec succès',
    type: Array<ReportResponseDto>,
  })
  @ApiBadRequestResponse({
    description: 'La recherche a échoué',
  })
  async getReportsByReportedId(@Param('id') id: string): Promise<ReportResponseDto[]> {
    const reports = await this.reportService.findReportsByReportedId(id);
    return ReportMapper.toResponseListDto(reports);
  }

  @Put('/:idComment')
  @ApiQuery({ name: 'idComment', required: false, type: Number })
  updateReportComment(): null {
    return null;
  }
}
