import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { NextFunction, Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Log } from '@/infra/decorators/log/log.decorator';
import { LoggerService } from '@/infra/decorators/log/logger.service';

interface UserIdentity {
  id: string;
  name: string;
  email: string;
}

interface AuthConfig {
  url: string;
}

declare module 'express' {
  interface Request {
    userIdentity?: UserIdentity;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  @Log('Authentication middleware')
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.baseUrl === '/graphql') {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.warn('No authorization header provided', 'AuthMiddleware');
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'Authorization header is required',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const appId = req.headers['x-app-id'] as string;
    if (!appId) {
      this.logger.warn('No x-app-id header provided', 'AuthMiddleware');
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'x-app-id header is required',
      });
    }

    const authUrl = this.configService.get<AuthConfig>('auth');
    if (!authUrl) {
      this.logger.error(
        'AUTH_URL not configured in environment',
        undefined,
        'AuthMiddleware',
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Authentication service not configured',
      });
    }

    const userIdentity = await this.authenticateUser(authUrl.url, appId, token);

    req.userIdentity = userIdentity;

    this.logger.log(
      `User authenticated successfully: ${userIdentity.id}`,
      'AuthMiddleware',
    );

    next();
  }

  @Log('Making authentication request to external service')
  private async authenticateUser(
    authUrl: string,
    appId: string,
    token: string,
  ): Promise<UserIdentity> {
    const response = await firstValueFrom(
      this.httpService.post(
        authUrl,
        { token },
        {
          headers: {
            'x-app-id': appId,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      ),
    );

    const userData = response.data as UserIdentity;
    if (!userData?.id || !userData?.name || !userData?.email) {
      throw new Error('Invalid user data received from authentication service');
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
  }
}
