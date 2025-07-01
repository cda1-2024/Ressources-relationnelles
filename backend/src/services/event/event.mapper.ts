import { FullEventResponseDto } from 'src/dto/event/response/full-event-response.dto';
import { EventListResponseDto, EventResponseDto } from 'src/dto/event/response/list-event-response.dto';
import { EventTypeToInt } from 'src/helper/enum-mapper';
import { Event } from 'src/models/event.model';

export class EventMapper {
  static toResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      manager: {
        id: event.manager.id,
        username: event.manager.username,
      },
      type: {
        id: EventTypeToInt[event.eventType],
        label: event.eventType,
      },
    };
  }

  static toResponseListDto(
    events: Event[],
    pageNumber: number,
    pageSize: number,
    totalNumberEvents: number,
  ): EventListResponseDto {
    return {
      events: events.map((event) => this.toResponseDto(event)),
      pageNumber,
      pageSize,
      totalNumberEvents,
      totalPages: Math.ceil(totalNumberEvents / pageSize),
    };
  }
  static toFullResponseDto(event: Event): FullEventResponseDto {
    return {
      id: event.id,
      title: event.title,
      content: event.content,
      isRestricted: event.isRestricted,
      deleted: event.deleted,
      suspended: event.suspended,
      manager: {
        id: event.manager.id,
        username: event.manager.username,
      },
      type: {
        id: EventTypeToInt[event.eventType],
        label: event.eventType,
      },
    };
  }
}
