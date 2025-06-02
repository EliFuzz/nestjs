import { Args, Query, Resolver } from '@nestjs/graphql';
import { Log } from '@/infra/decorators/log/log.decorator';
import { LoginService } from '@/module/user-access-management/login/login.service';
import { LoginValidationPipe } from '@/module/user-access-management/login/login-validation.pipe';
import {
  LoginInput,
  LoginPayload,
} from '@/module/user-access-management/login/login.schema';

@Resolver(() => LoginPayload)
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Query(() => LoginPayload)
  @Log('login user')
  async login(
    @Args('input', LoginValidationPipe) input: LoginInput,
  ): Promise<LoginPayload> {
    return this.loginService.login(input);
  }
}
