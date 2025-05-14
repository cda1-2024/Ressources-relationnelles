import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import * as dotenv from 'dotenv';
import { UsersModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';

dotenv.config();

const jwtConstants = { secret: process.env.JWT_KEY};

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 

})
export class AuthModule {}
