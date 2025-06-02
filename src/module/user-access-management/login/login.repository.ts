import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '@/infra/decorators/log/log.decorator';
import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';

@Injectable()
export class LoginRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Log('Finding user by email with selective fields')
  async userExists(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password'],
    });

    return user?.password ?? null;
  }
}
