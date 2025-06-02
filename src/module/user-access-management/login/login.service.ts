import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Log } from '@/infra/decorators/log/log.decorator';
import { LoginRepository } from '@/module/user-access-management/login/login.repository';
import {
  LoginInput,
  LoginPayload,
} from '@/module/user-access-management/login/login.schema';
import { Encryption } from '@/module/user-access-management/common/encyption/encryption';

@Injectable()
export class LoginService {
  constructor(
    private readonly encryption: Encryption,
    private readonly repository: LoginRepository,
  ) {}

  @Log('user login')
  async login(input: LoginInput): Promise<LoginPayload> {
    const actualPassword = await this.repository.userExists(input.email);

    if (
      !actualPassword ||
      !(await this.encryption.compare(input.password, actualPassword))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      token: 'JWT_TOKEN',
    };
  }
}
