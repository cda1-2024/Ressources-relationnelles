import { IProcessor } from 'typeorm-fixtures-cli';
import { Event, EventType } from '../../models/event.model';

export default class EventProcessor implements IProcessor<Event> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    const id: number = object.index as number;
    if (id <= 10) {
      object.eventType = EventType.MORPION;
    } else if (id <= 20) {
      object.eventType = EventType.MOTUS;
    } else {
      object.eventType = EventType.SONDAGE;
    }

    if (id % 2 == 0) {
      object.isRestricted = true;
    } else {
      object.isRestricted = false;
    }
    if (id % 3 == 0) {
      object.suspended = true;
    } else {
      object.suspended = false;
    }
    if (id % 4 == 0) {
      object.deleted = true;
    } else {
      object.deleted = false;
    }
  }
}
