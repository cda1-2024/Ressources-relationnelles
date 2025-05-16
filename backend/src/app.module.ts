import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { loadControllers } from './helper/loadControllers';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './configuration/data-source-app';
import { RessourceModule } from './modules/ressource.module';
import { CategoryModule } from './modules/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
     AuthModule,
     UserModule,
     RessourceModule,
     CategoryModule,
    ],
  controllers: loadControllers(),
  providers: [AppService],
})
export class AppModule {}
