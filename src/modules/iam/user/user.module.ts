import { Module } from '@nestjs/common';
import { UserService } from '@/src/modules/iam/user/user.service';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
})
export class UserModule {}
