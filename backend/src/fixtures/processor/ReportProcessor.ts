import { IProcessor } from 'typeorm-fixtures-cli';
import { ReportReason, UserReport } from '../../models/userReport.model';

export default class ReportProcessor implements IProcessor<UserReport> {
  // Fonction à garder pour l'exemple
  // preProcess(name: string, object: any): any {
  //   return { ...object, firstName: 'foo' };
  // }

  usedCombinations = new Set<string>();

  postProcess(name: string, object: { reporterId: string; reportedUserId: string; [key: string]: any }): void {
    const id: number = object.index as number;
    const reasons = Object.values(ReportReason);
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    object.ReportReason = randomReason;

    if (id % 2 == 0) {
      object.isResolved = true;
    } else {
      object.isResolved = false;
    }
  }
}
