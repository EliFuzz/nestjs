import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '@/infra/decorators/log/log.decorator';
import { UserEntity } from '@/module/user-access-management/common/entity/user.entity';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Log('new user registration')
  async userExists(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { email, password },
      select: ['password'],
    });

    return user?.password ?? null;
  }

  @Log('persisting user')
  async persist(email: string, password: string): Promise<string> {
    const user = this.userRepository.create({
      email,
      password,
    });

    return (await this.userRepository.save(user)).id;
  }
}
