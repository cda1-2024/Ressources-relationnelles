import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/validators/helper_validator/helper_validator.decorator';

export class FilterUserRequestDto {
  @ApiProperty({
    example: 'La fresqu',
    description: "Le username de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({
    example: true,
    description: 'status',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly banned?: boolean;

  @ApiProperty({
    example: false,
    description: 'status',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  readonly disabled?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Le numéro de la page',
  })
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Le nombre de users par page',
  })
  @IsOptional()
  @Type(() => Number)
  readonly pageSize: number = 10;
}
