import { Module } from '@nestjs/common';
import { UserModule } from '@/src/modules/iam/user/user.module';
import { AuthService } from '@/src/modules/iam/auth/auth.service';
import { AuthController } from '@/src/modules/iam/auth/auth.controller';
import { IamSharedModule } from '@/src/modules/iam/shared/iam-shared.module';
import { TokenModule } from '@/src/modules/iam/token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/src/modules/iam/auth/guards/jwt-auth.guard';

@Module({
  imports: [UserModule, TokenModule, IamSharedModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
  ],
})
export class AuthModule {}
