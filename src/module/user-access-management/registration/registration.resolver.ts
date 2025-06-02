import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegistrationValidationPipe } from '@/module/user-access-management/registration/registration-validation.pipe';
import {
  RegistrationInput,
  RegistrationPayload,
} from '@/module/user-access-management/registration/registration.schema';
import { Log } from '@/infra/decorators/log/log.decorator';
import { RegistrationService } from '@/module/user-access-management/registration/registration.service';

@Resolver(() => RegistrationPayload)
export class RegisterResolver {
  constructor(private readonly registrationService: RegistrationService) {}

  @Mutation(() => RegistrationPayload, { nullable: true })
  @Log('register user')
  async register(
    @Args('input', RegistrationValidationPipe) input: RegistrationInput,
  ): Promise<RegistrationPayload | null> {
    return this.registrationService.register(input);
  }
}
