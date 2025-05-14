import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { loadControllers } from './helper/loadControllers';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { CommentController } from './controller/comment.controller';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/user.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './configuration/data-source-app';


@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
     AuthModule,
     UsersModule
    ],
  controllers: loadControllers(),
  providers: [AppService],
})
export class AppModule {}
