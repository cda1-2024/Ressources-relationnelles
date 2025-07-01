import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ReportUserRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  reportReason: number;

  @ApiProperty()
  @IsOptional()
  reportedComment?: string;
}
