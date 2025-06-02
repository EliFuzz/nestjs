import { Injectable, NotFoundException } from '@nestjs/common';

import { Log } from '@/infra/decorators/log/log.decorator';
import {
  RegistrationInput,
  RegistrationPayload,
} from '@/module/user-access-management/registration/registration.schema';
import { RegistrationRepository } from '@/module/user-access-management/registration/registration.repository';
import { Encryption } from '@/module/user-access-management/common/encyption/encryption';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly encryption: Encryption,
    private readonly userRepository: RegistrationRepository,
  ) {}

  @Log('user login')
  async register(input: RegistrationInput): Promise<RegistrationPayload> {
    const userExists = await this.userRepository.userExists(
      input.email,
      input.password,
    );

    if (userExists) {
      throw new NotFoundException('User already exists');
    }

    const password = await this.encryption.hash(input.password);
    await this.userRepository.persist(input.email, password);

    return {
      token: `JWT_TOKEN: ${password}`,
    };
  }
}
