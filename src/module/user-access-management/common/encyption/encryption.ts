import { compare, hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Encryption {
  constructor(private readonly configService: ConfigService) {}

  async hash(value: string): Promise<string> {
    const passwordSalt = this.configService.get<string>('PASSWORD_SALT', '12');
    return hash(value, parseInt(passwordSalt));
  }

  async compare(actual: string, expected: string): Promise<boolean> {
    return compare(actual, expected);
  }
}
