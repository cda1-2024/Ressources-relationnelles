import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CollectRessourceRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Bookmark',
    description: "Type de sauvegarde",
    required: true,
  })
  readonly type: string;
}
