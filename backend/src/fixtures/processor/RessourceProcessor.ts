import { IProcessor } from 'typeorm-fixtures-cli';
import {
  Ressource,
  RessourceType,
  State,
  Visibility,
} from '../../models/ressource.model';

export default class RessourceProcessor implements IProcessor<Ressource> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    let id = object.id;
    // Select the type of the ressource
    let types = Object.values(RessourceType);
    let lenghtType = types.length;
    object.ressourceType = types[id % lenghtType];
    // Select the visibility of the ressource
    let visibility = Object.values(Visibility);
    let lenghtVisibility = visibility.length;
    object.visibility = visibility[id % lenghtVisibility];
    // Todo add multiple state for the ressources
  }
}
