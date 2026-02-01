import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/src/modules/iam/user/user.service';
import { PasswordService } from '@/src/modules/iam/shared/password.service';
import { AuthDto } from '@/src/modules/iam/auth/dto/auth.dto';
import { TokenService } from '@/src/modules/iam/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(registerDto: AuthDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userService.findOneWithPassword(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
    });

    await this.tokenService.saveRefreshToken(tokens.refreshToken, user.id);

    return tokens;
  }

  async login(loginDto: AuthDto) {
    const { email, password } = loginDto;

    const userFromDb = await this.userService.findOneWithPassword(email);

    if (
      !userFromDb ||
      !(await this.passwordService.comparePassword(
        userFromDb.password,
        password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.generateTokens({
      sub: userFromDb.id,
      email: userFromDb.email,
    });

    await this.tokenService.saveRefreshToken(
      tokens.refreshToken,
      userFromDb.id,
    );

    return tokens;
  }

  async refresh(token: string) {
    const tokenFromDb = await this.tokenService.findRefreshToken(token);

    if (!tokenFromDb || tokenFromDb.expiresAt > new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneWithPassword(tokenFromDb.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
      email: user.email,
    });

    await this.tokenService.saveRefreshToken(tokens.refreshToken, user.id);

    return tokens;
  }

  async logout(token: string) {
    const tokenFromDb = await this.tokenService.findRefreshToken(token);

    if (!tokenFromDb) {
      return {
        success: true,
      };
    }

    await this.tokenService.deleteRefreshToken(tokenFromDb.token);

    return {
      success: true,
    };
  }

  async me(id: string) {
    return this.userService.findOne(id);
  }
}
