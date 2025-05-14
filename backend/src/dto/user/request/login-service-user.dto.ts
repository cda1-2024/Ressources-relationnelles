import { ApiProperty } from '@nestjs/swagger';

export class loginUserServiceDto {
  @ApiProperty({
    example: 'GZRE21v5r6g1z26165f1ezgFErg4rtgefze5f64ffe15f6zffzffezezafza',
    description: 'Le token du service',
  })
  token: string;

  @ApiProperty({
    example: 'Google',
    description: 'Le nom du service de auth',
  })
  type_service: string;
}
