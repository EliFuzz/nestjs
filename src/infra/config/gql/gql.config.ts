import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphQLFormattedError } from 'graphql/error';
import { ProblemError } from '@/infra/filters/error/error.filter';

export class GqlConfig {
  public static readonly forRoot = () =>
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema/schema.gql'),
      sortSchema: true,
      graphiql: true,
      playground: {
        subscriptionEndpoint: '/graphql',
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: ({ req, res, connection }) => {
        if (req) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { req, res };
        }
        if (connection) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          return { req: connection.context };
        }
      },
      formatError: (error): GraphQLFormattedError => {
        if (error.extensions?.exception) {
          const exception = error.extensions.exception as ProblemError;
          if (exception.code && exception.name && exception.errors) {
            return {
              message: exception.errors[0]?.message || error.message,
              code: exception.code,
              name: exception.name,
              timestamp: exception.timestamp,
            } as GraphQLFormattedError;
          }
        }

        return {
          message: error.message,
          code: error.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        } as GraphQLFormattedError;
      },
    });
}
