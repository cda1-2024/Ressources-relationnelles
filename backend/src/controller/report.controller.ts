import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportUserRequestDto } from 'src/dto/report/request/report-request.dto';
import { ReportResponseDto } from 'src/dto/report/response/report-response.dto';
import { CurrentUser } from 'src/middleware/guards/current-user.decorator';
import { Roles } from 'src/middleware/guards/roles.decorator';
import { RolesGuard } from 'src/middleware/guards/roles.guard';
import { User, UserRole } from 'src/models/user.model';
import { ReportMapper } from 'src/services/report/report.mapper';
import { ReportService } from 'src/services/report/report.service';

@ApiTags('Reports')
@Controller('api/reports/')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/:idUser')
  @ApiQuery({ name: 'idUser', required: false, type: String })
  @ApiOperation({
    summary: 'Signaler un commentaire',
    description: 'Permet de signaler un commentaire en fournissant les informations nécessaires',
  })
  @ApiOkResponse({
    description: 'Le commentaire a été signalé avec succès',
  })
  @ApiBadRequestResponse({
    description: 'La requête de signalement a échoué',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async reportUser(
    @Param('idUser') idUser: string,
    @Body() reportUserRequestDto: ReportUserRequestDto,
    @CurrentUser() currentUser: User,
  ): Promise<void> {
    await this.reportService.reportUser(currentUser, idUser, reportUserRequestDto);
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
