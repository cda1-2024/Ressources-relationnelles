import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourceModule } from './modules/ressource.module';
import { CategoryModule } from './modules/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import datasource from './configuration/data-source';
import { DataSourceOptions } from 'typeorm';
import { EventModule } from './modules/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datasource],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = configService.get<DataSourceOptions>('datasource');
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
    EventModule,
  ],
  providers: [AppService],
})
export class AppModule {}
