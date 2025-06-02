import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import * as path from 'path';
import { GqlConfig } from '@/infra/config/gql/gql.config';

jest.mock('@nestjs/graphql', () => ({
  GraphQLModule: {
    forRoot: jest.fn().mockReturnValue('mocked-graphql-module'),
  },
}));

jest.mock('@nestjs/apollo', () => ({
  ApolloDriver: jest.fn().mockImplementation(() => ({})),
  ApolloDriverConfig: {},
}));

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('mocked/schema/path/schema.gql'),
}));

const originalCwd = process.cwd.bind(process) as jest.Mock;

describe('GraphqlConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.cwd = originalCwd;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.cwd = originalCwd;
  });

  it('GraphqlConfig.forRoot returns GraphQLModule', () => {
    const result = GqlConfig.forRoot();

    expect(GraphQLModule.forRoot).toHaveBeenCalled();
    expect(result).toBe('mocked-graphql-module');
  });

  it('Correct Apollo driver configuration', () => {
    GqlConfig.forRoot();

    expect(GraphQLModule.forRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        driver: ApolloDriver,
      }),
    );
  });

  it('GraphiQL is enabled', () => {
    GqlConfig.forRoot();

    expect(GraphQLModule.forRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        graphiql: true,
      }),
    );
  });

  it('Schema file path is correct', () => {
    const mockCwd = '/mock/project/root';
    process.cwd = jest.fn().mockReturnValue(mockCwd);

    GqlConfig.forRoot();

    expect(path.join).toHaveBeenCalledWith(mockCwd, 'schema/schema.gql');
    expect(GraphQLModule.forRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        autoSchemaFile: 'mocked/schema/path/schema.gql',
      }),
    );
  });

  it('Schema sorting is enabled', () => {
    GqlConfig.forRoot();

    expect(GraphQLModule.forRoot).toHaveBeenCalledWith(
      expect.objectContaining({
        sortSchema: true,
      }),
    );
  });

  it('Module handles process.cwd() changes', () => {
    const mockCwd1 = '/first/project/root';
    const mockCwd2 = '/second/project/root';

    process.cwd = jest.fn().mockReturnValue(mockCwd1);
    GqlConfig.forRoot();

    process.cwd = jest.fn().mockReturnValue(mockCwd2);
    GqlConfig.forRoot();

    expect(path.join).toHaveBeenCalledWith(mockCwd1, 'schema/schema.gql');
    expect(path.join).toHaveBeenCalledWith(mockCwd2, 'schema/schema.gql');
    expect(path.join).toHaveBeenCalledTimes(2);
  });
});
