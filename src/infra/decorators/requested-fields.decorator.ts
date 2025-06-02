import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { getFieldList } from '@/infra/config/gql/requested-fields';

export const RequestedFields = createParamDecorator(
  (fieldPrefix: string | undefined, context: ExecutionContext) =>
    getFieldList(
      GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>(),
    ),
);
