import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/dto/ressource/response/common-dtos.dto';

class ReportReason {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;
}

export class ReportResponseDto {
  @ApiProperty({ type: UserDto })
  reportedUser: UserDto;

  @ApiProperty({ type: UserDto })
  reporter: UserDto;

  @ApiProperty()
  content: string;

  @ApiProperty()
  moderatorView: string;

  @ApiProperty()
  isResolved: boolean;

  @ApiProperty({ type: ReportReason })
  reportReason: ReportReason;

  @ApiProperty()
  reportedComment?: string;

  @ApiProperty()
  createdAt: string;
}
