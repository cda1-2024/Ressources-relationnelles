import { IProcessor } from 'typeorm-fixtures-cli';
import { User, UserRole } from '../../models/user.model';

export default class UserProcessor implements IProcessor<User> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    object.username = `${object.username}${Math.floor(Math.random() * (9999 - 1000) + 1000)}`;
    if (object.id == 1) {
      object.role = UserRole.VISITOR;
    } else if (object.id >= 2 && object.id <= 3) {
      object.role = UserRole.SUPERADMIN;
    } else if (object.id >= 4 && object.id <= 5) {
      object.role = UserRole.ADMIN;
    } else if (object.id >= 6 && object.id <= 15) {
      object.role = UserRole.MODERATOR;
    } else {
      object.role = UserRole.USER;
    }
  }
}
