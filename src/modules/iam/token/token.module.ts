import { Module } from '@nestjs/common';
import { PrismaModule } from '@/src/infra/prisma/prisma.module';
import { TokenService } from '@/src/modules/iam/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from '@/src/infra/env/env.module';
import { EnvService } from '@/src/infra/env/env.service';
import { JwtStrategy } from '@/src/modules/iam/token/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService): any => ({
        global: true,
        secret: envService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: envService.get('JWT_AT_EXPIRES'),
        },
      }),
      inject: [EnvService],
    }),
    PrismaModule,
    EnvModule,
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
