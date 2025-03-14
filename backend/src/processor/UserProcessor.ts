import { IProcessor } from 'typeorm-fixtures-cli';
import { User } from '../models/user.model';

export default class UserProcessor implements IProcessor<User> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  // TODO ajouter la fonction pour modifier le mot de passe
  postProcess(name: string, object: { [key: string]: any }): void {
    object.password = "test";
  }
}