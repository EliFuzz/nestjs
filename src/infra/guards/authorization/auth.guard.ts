import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { APP_GUARD } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext<{
      req: Request;
    }>();
    return !req.header('authorization');
  }
}

export default {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
