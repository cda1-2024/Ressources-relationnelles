import { AppException } from './app.exception';

export class RepositoryException extends AppException {
  constructor(
    message: string,
    status: number,
    options: {
      cause?: unknown;
      sqlError?: string;
      errno?: number;
      sqlCode?: string;
      sqlState?: string;
      query?: string;
      params?: string;
    } = {},
  ) {
    super(message, status, { cause: options.cause });

    this._sqlError = options.sqlError;
    this._errno = options.errno;
    this._sqlCode = options.sqlCode;
    this._sqlState = options.sqlState;
    this._query = options.query;
    this._params = options.params;
  }

  private readonly _sqlError?: string;
  private readonly _errno?: number;
  private readonly _sqlCode?: string;
  private readonly _sqlState?: string;
  private readonly _query?: string;
  private readonly _params?: string;

  override getDetails(): Record<string, unknown> {
    return {
      sqlError: this._sqlError,
      errno: this._errno,
      sqlCode: this._sqlCode,
      sqlState: this._sqlState,
      query: this._query,
      params: this._params,
    };
  }
}
