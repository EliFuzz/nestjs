import { Injectable, PipeTransform } from '@nestjs/common';
import { Log } from '@/infra/decorators/log/log.decorator';
import { UserInput } from '@/module/user-access-management/user-management/user.schema';

@Injectable()
export class UserValidationPipe implements PipeTransform<UserInput> {
  @Log('user input validation')
  async transform(value: UserInput) {
    return Promise.resolve(value);
  }
}
