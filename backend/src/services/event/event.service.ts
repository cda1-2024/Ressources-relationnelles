import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterEventRequestDto } from 'src/dto/event/request/filter-event.dto';
import { Event } from 'src/models/event.model';
import { User } from 'src/models/user.model';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEventRequestDto } from 'src/dto/event/request/create-event.dto';
import { BusinessException } from 'src/helper/exceptions/business.exception';
import { getErrorStatusCode } from 'src/helper/exception-utils';
import { createLoggedRepository } from 'src/helper/safe-repository';
import { EventTypeFromInt } from 'src/helper/enum-mapper';
import { EventParticipation } from 'src/models/eventParticipation.model';

@Injectable()
export class EventService {
  private readonly eventsRepository: Repository<Event>;
  private readonly eventParticipationRepository: Repository<EventParticipation>;

  constructor(
    @InjectRepository(Event) eventsRepository: Repository<Event>,
    @InjectRepository(EventParticipation) eventParticipationRepository: Repository<EventParticipation>,
  ) {
    this.eventsRepository = createLoggedRepository(eventsRepository);
    this.eventParticipationRepository = createLoggedRepository(eventParticipationRepository);
  }

  async findEventAll(): Promise<Event[]> {
    try {
      const Events = await this.eventsRepository.find({
        relations: {
          manager: true,
        },
      });
      return Events;
    } catch (error) {
      throw new BusinessException('La recherche des Events a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async findEventsBySearch(
    user: User | null,
    filters: FilterEventRequestDto,
  ): Promise<{ events: Event[]; total: number }> {
    try {
      if (filters.page < 1 || filters.pageSize < 1) {
        throw new BadRequestException('Les paramètres de pagination doivent être supérieurs à 0');
      }

      const query = this.eventsRepository.createQueryBuilder('Event').leftJoinAndSelect('Event.manager', 'manager');

      this.applyCommonFilters(query, filters);
      query.andWhere('Event.deleted = false');
      query.andWhere('Event.suspended = false');
      query.andWhere('Event.isRestricted = false');

      const total = await query.getCount();

      query.skip((filters.page - 1) * filters.pageSize).take(filters.pageSize);

      const events = await query.getMany();
      return { events, total };
    } catch (error) {
      throw new BusinessException('La recherche des Events a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async findEventById(id: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
        relations: {
          manager: true,
        },
      });

      if (!event) {
        throw new NotFoundException("La Event n'a pas été trouvée");
      }
      return event;
    } catch (error) {
      throw new BusinessException('La recherche de la Event a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async createEvent(user: User, event: CreateEventRequestDto): Promise<Event> {
    try {
      const newEvent = new Event();
      newEvent.title = event.title;
      newEvent.content = event.content;
      newEvent.eventType = EventTypeFromInt[event.type];
      newEvent.manager = user;
      newEvent.isRestricted = event.isRestricted;

      const saveEvent = this.eventsRepository.save(newEvent);

      return saveEvent;
    } catch (error) {
      throw new BusinessException('La création de la Event a échoué', getErrorStatusCode(error), { cause: error });
    }
  }

  async participateEvent(user: User, EventId: string): Promise<void> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id: EventId },
      });
      if (!event) {
        throw new NotFoundException("La Event n'existe pas");
      }
      const eventParticipation = new EventParticipation();
      eventParticipation.user = user;
      eventParticipation.event = event;
      eventParticipation.dateTimeParticipation = new Date();
      await this.eventParticipationRepository.save(eventParticipation);
    } catch (error) {
      throw new BusinessException("La participation à l'évènement a échoué", getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async deleteEvent(id: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException("L'évènement n'existe pas");
      }
      event.deleted = true;
      await this.eventsRepository.save(event);
      return event;
    } catch (error) {
      throw new BusinessException('La suppression de la Event a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  async suspendEvent(id: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException("L'évènement n'existe pas");
      }
      event.suspended = true;
      await this.eventsRepository.save(event);
      return event;
    } catch (error) {
      throw new BusinessException('La suppression de la Event a échoué', getErrorStatusCode(error), {
        cause: error,
      });
    }
  }

  private applyCommonFilters(
    query: SelectQueryBuilder<Event>,
    filters: FilterEventRequestDto,
  ): SelectQueryBuilder<Event> {
    if (filters.query) {
      query = query.andWhere('Event.title LIKE :title', {
        title: `%${filters.query}%`,
      });
    }
    if (filters.type) {
      query = query.andWhere('Event.EventType = :EventType', {
        EventType: filters.type,
      });
    }
    return query;
  }
}
