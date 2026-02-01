import { Module } from '@nestjs/common';
import { AuthModule } from '@/src/modules/iam/auth/auth.module';
import { UserModule } from '@/src/modules/iam/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class IamModule {}
