import { Args, Query, Resolver } from '@nestjs/graphql';

import { Log } from '@/infra/decorators/log/log.decorator';
import {
  UserInput,
  UserPayload,
} from '@/module/user-access-management/user-management/user.schema';
import { UserValidationPipe } from '@/module/user-access-management/user-management/user-validation.pipe';
import { RequestedFields } from '@/infra/decorators/requested-fields.decorator';
import { UserService } from '@/module/user-access-management/user-management/user.service';

@Resolver(() => UserPayload)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserPayload, { nullable: true })
  @Log('user information retrieval')
  async user(
    @Args('input', UserValidationPipe) input: UserInput,
    @RequestedFields() fields: string[],
  ): Promise<UserPayload> {
    return this.userService.getUser(input, fields);
  }
}
