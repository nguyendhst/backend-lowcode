import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from '@services/authentication.service';
import { LoginDto, RefreshDto } from '@dtos/auth.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('refresh')
  async refresh(@Body() loginDto: RefreshDto) {
    return this.authService.refresh(loginDto);
  }
}
