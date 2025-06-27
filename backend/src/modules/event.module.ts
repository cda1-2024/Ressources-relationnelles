import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from 'src/controller/event.controller';
import { Event } from 'src/models/event.model';
import { EventParticipation } from 'src/models/eventParticipation.model';
import { EventService } from 'src/services/event/event.service';

@Module({
  controllers: [EventController],
  imports: [TypeOrmModule.forFeature([Event, EventParticipation])],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
