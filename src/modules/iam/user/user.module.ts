import { Module } from '@nestjs/common';
import { UserService } from '@/src/modules/iam/user/user.service';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { IamSharedModule } from '@/src/modules/iam/shared/iam-shared.module';

@Module({
  imports: [PrismaModule, IamSharedModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
