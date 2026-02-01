import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from '@/src/modules/iam/shared/iam.types';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '@/src/infra/env/env.service';
import { add } from 'date-fns';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = uuidv4();

    return {
      accessToken,
      refreshToken,
    };
  }

  async findRefreshToken(token: string) {
    return this.prismaService.token.findUnique({
      where: {
        token,
      },
    });
  }

  async saveRefreshToken(token: string, userId: string) {
    return this.prismaService.token.upsert({
      where: {
        userId,
      },
      update: {
        token,
        expiresAt: new Date(
          add(new Date(), { days: this.getRefreshTokenExpires() }),
        ),
      },
      create: {
        token,
        userId,
        expiresAt: new Date(
          add(new Date(), { days: this.getRefreshTokenExpires() }),
        ),
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({
      where: {
        token,
      },
    });
  }

  private getRefreshTokenExpires() {
    return parseInt(this.envService.get('JWT_RT_EXPIRES'));
  }
}
