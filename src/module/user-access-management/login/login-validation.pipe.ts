import { Injectable, PipeTransform } from '@nestjs/common';
import { Log } from '@/infra/decorators/log/log.decorator';
import { LoginInput } from '@/module/user-access-management/login/login.schema';

@Injectable()
export class LoginValidationPipe implements PipeTransform<LoginInput> {
  @Log('login input validation')
  transform(input: LoginInput): Promise<LoginInput> {
    return Promise.resolve(input);
  }
}
