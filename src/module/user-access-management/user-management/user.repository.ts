import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  USER_ENTITY,
  UserEntity,
} from '@/module/user-access-management/common/entity/user.entity';
import { Repository } from 'typeorm';
import { Log } from '@/infra/decorators/log/log.decorator';
import { toUserEntityFields } from '@/module/user-access-management/user-management/user.transform';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Log('get user by id')
  async findById(id: string, fields: string[]): Promise<UserEntity | null> {
    const query = this.userRepository.createQueryBuilder(USER_ENTITY);

    query.where('user.id = :id', { id });
    query.select(toUserEntityFields(USER_ENTITY, fields));

    return query.getOne();
  }
}
