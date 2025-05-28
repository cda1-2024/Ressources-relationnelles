import { IProcessor } from 'typeorm-fixtures-cli';
import { Ressource, RessourceType, Visibility ,Status} from '../../models/ressource.model';

export default class RessourceProcessor implements IProcessor<Ressource> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    const id: number = object.index as number;
    if (id <= 10) {
      object.status = Status.PUBLISHED;
    } else if (id <= 20) {
      object.status = Status.SUSPENDED;
    } else if (id <= 30) {
      object.status = Status.TOVALIDATE;
    } else if (id <= 40) {
      object.status = Status.DELETED;
    } else {
      object.status = Status.DRAFT;
    }

    // Every 6 resources, the ressource doesn't have a category
    if (id % 6 == 0) {
      object.category = null;
    }
    // Select the type of the ressource
    const types = Object.values(RessourceType);
    const lenghtType = types.length;
    object.ressourceType = types[id % lenghtType];
    if (object.ressourceType == RessourceType.TEXT) {
      object.contentLink = null;
    }
    // Select the visibility of the ressource
    const visibility = Object.values(Visibility);
    const lenghtVisibility = visibility.length;
    object.visibility = visibility[id % lenghtVisibility];
  }
}
