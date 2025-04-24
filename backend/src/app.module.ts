import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { loadControllers } from './helper/loadControllers';

@Module({
  imports: [],
  controllers: loadControllers(), 
  providers: [AppService],
})
export class AppModule {}
