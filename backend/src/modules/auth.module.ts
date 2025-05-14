import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import * as dotenv from 'dotenv';
import { UsersModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import passport from 'passport';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/configuration/jwt.strategy';

dotenv.config();

const jwtConstants = { secret: process.env.JWT_KEY };

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
