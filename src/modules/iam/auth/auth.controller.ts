import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthDto } from '@/src/modules/iam/auth/dto/auth.dto';
import { AuthService } from '@/src/modules/iam/auth/auth.service';
import { Public } from '@/src/modules/iam/shared/decorators/public.decorator';
import { RefreshDto } from '@/src/modules/iam/auth/dto/refresh.dto';
import { User } from '@/src/modules/iam/shared/decorators/current-user.decorator';
import { type CurrentUser } from '@/src/modules/iam/shared/iam.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: AuthDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshDto) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body() { refreshToken }: RefreshDto) {
    return this.authService.logout(refreshToken);
  }

  @Get('me')
  async me(@User() { id }: CurrentUser) {
    return this.authService.me(id);
  }
}
