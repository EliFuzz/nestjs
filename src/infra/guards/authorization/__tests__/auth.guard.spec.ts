import authGuardProvider, {
  AuthGuard,
} from '@/infra/guards/authorization/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('AuthGuard Provider', () => {
  let authGuard: AuthGuard;
  let mockContext: ExecutionContext;
  let mockGqlContext: { req: { header: jest.Mock } };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);

    mockContext = {
      getType: jest.fn(),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ExecutionContext;

    mockGqlContext = {
      req: {
        header: jest.fn(),
      },
    };

    const mockGetContext = jest.fn().mockReturnValue(mockGqlContext);
    const mockCreateReturn = { getContext: mockGetContext };

    (GqlExecutionContext.create as jest.Mock).mockImplementation(
      () => mockCreateReturn,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true when authorization header is not present', () => {
    mockGqlContext.req.header.mockImplementation(() => undefined);

    const result = authGuard.canActivate(mockContext);

    expect(mockGqlContext.req.header).toHaveBeenCalledWith('authorization');
    expect(result).toBe(true);
  });

  it('should return false when authorization header is present', () => {
    mockGqlContext.req.header.mockImplementation(() => 'Bearer token123');

    const result = authGuard.canActivate(mockContext);

    expect(mockGqlContext.req.header).toHaveBeenCalledWith('authorization');
    expect(result).toBe(false);
  });

  it('should return true for valid authorization header', () => {
    mockGqlContext.req.header.mockImplementation(() => '');

    const result = authGuard.canActivate(mockContext);

    expect(mockGqlContext.req.header).toHaveBeenCalledWith('authorization');
    expect(result).toBe(true);
  });

  it('should create GqlExecutionContext with the provided context', async () => {
    mockGqlContext.req.header.mockImplementation(() => undefined);

    await authGuard.canActivate(mockContext);

    expect(GqlExecutionContext['create']).toHaveBeenCalledWith(mockContext);
  });

  it('should provide AuthGuard as APP_GUARD', () => {
    expect(authGuardProvider).toEqual({
      provide: APP_GUARD,
      useClass: AuthGuard,
    });
  });
});
