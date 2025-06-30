import { HttpStatus } from '@nestjs/common';
import { Repository, QueryFailedError, ObjectLiteral } from 'typeorm';
import { RepositoryException } from 'src/helper/exceptions/repository.exception';

interface MysqlError extends Error {
  code: string;
  errno: number;
  sqlMessage: string;
  sqlState: string;
}

const syncMethods = new Set([
  'create',
  'merge',
  'hasId',
  'getId',
  'createQueryBuilder',
  'manager',
  'metadata',
  'target',
  'query',
]);

export function createLoggedRepository<T extends ObjectLiteral>(repo: Repository<T>): Repository<T> {
  const handler: ProxyHandler<Repository<T>> = {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver) as unknown;

      if (typeof original !== 'function') {
        return original;
      }

      if (syncMethods.has(String(prop))) {
        return (...args: unknown[]): unknown => {
          return original.apply(target, args);
        };
      }

      return async (...args: unknown[]): Promise<unknown> => {
        try {
          return await original.apply(target, args);
        } catch (error) {
          let sqlCode: string | undefined;
          let errno: number | undefined;
          let sqlError: string | undefined;
          let sqlState: string | undefined;
          let query: string | undefined;
          let params: string | undefined;

          if (error instanceof QueryFailedError) {
            const driverError: MysqlError = error.driverError as MysqlError;
            sqlCode = driverError?.code;
            errno = driverError?.errno;
            sqlError = driverError?.sqlMessage;
            sqlState = driverError?.sqlState;
            query = error.query;
            params = error.parameters?.toString();
          }

          throw new RepositoryException(`Erreur dans Repository.${String(prop)}`, HttpStatus.INTERNAL_SERVER_ERROR, {
            cause: error,
            sqlError,
            errno,
            sqlCode,
            sqlState,
            query,
            params,
          });
        }
      };
    },
  };

  return new Proxy(repo, handler);
}
