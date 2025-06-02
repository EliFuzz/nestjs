import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Problem } from '@/infra/error/problem';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpAdapterHost } from '@nestjs/core';

interface ProblemErrorContext {
  message: string;
}

export interface ProblemError {
  code: number;
  name: string;
  errors: ProblemErrorContext[];
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public static readonly toProblem = (exception: any): Problem => {
    switch (true) {
      case exception instanceof HttpException:
        return Problem.fromHttpError(exception);
      case exception instanceof Problem:
        return exception;
      default:
        return Problem.from(exception as Error);
    }
  };

  private static readonly response = (problem: Problem): ProblemError => {
    return {
      code: problem.code,
      name: problem.name,
      timestamp: new Date().toISOString(),
      errors: [
        {
          message: problem.message,
        },
      ],
    };
  };

  catch(exception: any, host: ArgumentsHost): any {
    const { httpAdapter } = this.httpAdapterHost;

    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const isGql = gqlHost.getType<ContextType | 'graphql'>() === 'graphql';
    const info = JSON.stringify(isGql ? gqlHost.getInfo() : request);
    const problem = GlobalExceptionFilter.toProblem(exception);

    this.log(problem, info);

    if (isGql) {
      throw new GraphQLError(problem.message, {
        extensions: {
          code: problem.name,
          statusCode: problem.code,
          timestamp: new Date().toISOString(),
          originalError: problem.errorMessage,
        },
      });
    } else {
      const response = ctx.getResponse<Response>();
      const httpStatus = problem.code || 500;
      httpAdapter.reply(
        response,
        GlobalExceptionFilter.response(problem),
        httpStatus,
      );
    }
  }

  private readonly log = (problem: Problem, info: string): void => {
    this.logger.error(
      `[${problem.name}] ${problem.message}: ${problem.errorMessage} - ${info}`,
      problem.stack,
    );
  };
}
