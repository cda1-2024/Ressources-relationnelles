import { IProcessor } from 'typeorm-fixtures-cli';
import { Comment } from '../../models/comment.model';

export default class CommentProcessor implements IProcessor<Comment> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  postProcess(name: string, object: { [key: string]: any }): void {
    if (object.index % 7 == 0) {
      object.deleted = true;
    }
  }
}
