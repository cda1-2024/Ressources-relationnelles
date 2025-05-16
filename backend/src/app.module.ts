import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { loadControllers } from './helper/loadControllers';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourceModule } from './modules/ressource.module';
import { CategoryModule } from './modules/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import datasource from './configuration/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datasource],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options = configService.get('datasource');
        if (!options) {
          throw new Error('TypeOrm configuration is missing');
        }
        return options;
      },
    }),
    AuthModule,
    UserModule,
    RessourceModule,
    CategoryModule,
  ],
  controllers: loadControllers(),
  providers: [AppService],
})
export class AppModule {}
