import { IProcessor } from 'typeorm-fixtures-cli';
import { User, UserRole } from '../../models/user.model';

export default class UserProcessor implements IProcessor<User> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    object.username = `${object.username}${Math.floor(Math.random() * (9999 - 1000) + 1000)}`;
    if (object.index == 1) {
      object.role = UserRole.VISITOR;
    } else if (object.index >= 2 && object.index <= 3) {
      object.role = UserRole.SUPERADMIN;
    } else if (object.index >= 4 && object.index <= 5) {
      object.role = UserRole.ADMIN;
    } else if (object.index >= 6 && object.index <= 15) {
      object.role = UserRole.MODERATOR;
    } else {
      object.role = UserRole.USER;
    }
  }
}
