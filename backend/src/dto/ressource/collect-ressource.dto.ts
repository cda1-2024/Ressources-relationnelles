import { ApiProperty } from '@nestjs/swagger';

export class CollectRessourceDto {
  @ApiProperty({
    example: 'Bookmark',
    description: "Type de sauvegarde",
    required: true,
  })
  readonly type: string;
}
