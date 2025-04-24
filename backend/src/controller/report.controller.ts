import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('api/reports/')
export class ReportController {
  @Post('/:idComment')
  @ApiQuery({ name: 'idComment', required: false, type: Number })
  reportComment(): null {
    return null;
  }

  @Put('/:idComment')
  @ApiQuery({ name: 'idComment', required: false, type: Number })
  updateReportComment(): null {
    return null;
  }
}


