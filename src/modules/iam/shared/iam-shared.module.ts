import { Module } from '@nestjs/common';
import { PasswordService } from '@/src/modules/iam/shared/password.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class IamSharedModule {}
