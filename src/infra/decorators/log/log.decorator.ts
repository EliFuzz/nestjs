import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import instance from '@/infra/config/logger/logger.config';

interface DecoratorTarget {
  constructor: {
    name: string;
  };
}

export function Log(message: string) {
  return function (
    target: DecoratorTarget,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value as (...args: any[]) => any;
    const methodName = propertyName;
    const className = target.constructor.name;
    const logPrefix = `${className}.${methodName}`;

    const logger = instance as unknown as Logger;

    descriptor.value = function (...args: any[]) {
      const startTime = Date.now();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = method.apply(this, args);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof result?.then === 'function') {
        return handlePromise(
          result as Promise<any>,
          logger,
          logPrefix,
          message,
          startTime,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (typeof result?.subscribe === 'function') {
        return handleObservable(
          result as Observable<any>,
          logger,
          logPrefix,
          message,
          startTime,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return handleSync(result, logger, logPrefix, message, startTime);
    };

    return descriptor;
  };
}

function logProcessing(
  logger: Logger,
  logPrefix: string,
  message: string,
): void {
  logger.log(`[${logPrefix}] Processing ${message}`, { context: logPrefix });
}

function logSuccess(
  logger: Logger,
  logPrefix: string,
  message: string,
  elapsed: number,
): void {
  logger.log(`[${logPrefix}][${elapsed}ms] Processed ${message}`, {
    context: logPrefix,
    elapsed,
  });
}

function logFailure(
  logger: Logger,
  logPrefix: string,
  message: string,
  elapsed: number,
  error: any,
): void {
  logger.error(`[${logPrefix}][${elapsed}ms] Failed to process ${message}`, {
    context: logPrefix,
    elapsed,
    error: JSON.stringify(error),
    stack: (error as Error)?.stack,
  });
}

function handleSync(
  result: any,
  logger: Logger,
  logPrefix: string,
  message: string,
  startTime: number,
): any {
  try {
    logProcessing(logger, logPrefix, message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = result;
    logSuccess(logger, logPrefix, message, Date.now() - startTime);
    return response;
  } catch (error) {
    logFailure(logger, logPrefix, message, Date.now() - startTime, error);
    throw error;
  }
}

async function handlePromise(
  promise: Promise<any>,
  logger: Logger,
  logPrefix: string,
  message: string,
  startTime: number,
): Promise<any> {
  try {
    logProcessing(logger, logPrefix, message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await promise;
    logSuccess(logger, logPrefix, message, Date.now() - startTime);
    return result;
  } catch (error) {
    logFailure(logger, logPrefix, message, Date.now() - startTime, error);
    throw error;
  }
}

function handleObservable(
  observable: Observable<any>,
  logger: Logger,
  logPrefix: string,
  message: string,
  startTime: number,
): Observable<any> {
  logProcessing(logger, logPrefix, message);
  return observable.pipe(
    tap(() => {
      logSuccess(logger, logPrefix, message, Date.now() - startTime);
    }),
    catchError((error) => {
      logFailure(logger, logPrefix, message, Date.now() - startTime, error);
      return throwError(() => error as Error);
    }),
  );
}
