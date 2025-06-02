import { Injectable, PipeTransform } from '@nestjs/common';
import { Log } from '@/infra/decorators/log/log.decorator';
import { RegistrationInput } from '@/module/user-access-management/registration/registration.schema';

@Injectable()
export class RegistrationValidationPipe
  implements PipeTransform<RegistrationInput>
{
  @Log('registration input validation')
  async transform(value: RegistrationInput) {
    return Promise.resolve(value);
  }
}
