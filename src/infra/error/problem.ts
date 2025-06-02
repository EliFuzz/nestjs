import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

export class Problem extends Error {
  code: number;
  errorMessage?: string;
  timestamp: Date;

  constructor(
    code: number,
    message: string,
    errorMessage?: string,
    stack?: string,
  ) {
    super(Problem.cleanMessage(message), { cause: new Error(errorMessage) });

    const httpStatusName = Object.fromEntries(
      Object.entries(HttpStatus).map(([key, value]) => [value, key]),
    );

    this.code = code;
    this.name = httpStatusName[code];
    this.errorMessage = errorMessage;
    this.stack = stack;
    this.timestamp = new Date();
  }

  static from(error: Error): Problem {
    return new Problem(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      error.message,
      error.stack,
    );
  }

  static fromHttpError(error: HttpException): Problem {
    const response = error.getResponse() as {
      message: string | string[];
      error: string;
      statusCode: number;
    };

    const message = Array.isArray(response.message)
      ? response.message.join(', ')
      : response.message;

    return new Problem(
      response.statusCode,
      Problem.cleanMessage(message),
      `${response.error}: ${message}`,
      error.stack,
    );
  }

  static badRequest(message: string, e?: Error): Problem {
    return new Problem(
      HttpStatus.BAD_REQUEST,
      message,
      Problem.cleanMessage(e?.message ?? ''),
      e?.stack,
    );
  }

  private static readonly cleanMessage = (message: string): string =>
    message.replace('"', "'");
}
