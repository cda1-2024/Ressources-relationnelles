import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controller/user.controller';
import { RessrouceController } from './controller/ressoruce.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, RessrouceController],
  providers: [AppService],
})
export class AppModule {}
