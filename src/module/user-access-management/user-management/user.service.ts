import { Injectable, NotFoundException } from '@nestjs/common';
import { Log } from '@/infra/decorators/log/log.decorator';
import {
  UserInput,
  UserPayload,
} from '@/module/user-access-management/user-management/user.schema';
import { UserRepository } from '@/module/user-access-management/user-management/user.repository';
import { toUserPayload } from '@/module/user-access-management/user-management/user.transform';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Log('user information')
  async getUser(input: UserInput, fields: string[]): Promise<UserPayload> {
    const user = await this.userRepository.findById(input.id, fields);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toUserPayload(user);
  }
}
