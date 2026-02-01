import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class PasswordService {
  async hashPassword(password: string) {
    return argon.hash(password);
  }

  async comparePassword(hash: string, password: string) {
    return argon.verify(hash, password);
  }
}
