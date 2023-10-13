import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '@services/authentication.service';
import { LoginDto, RefreshDto } from '@dtos/auth.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Public } from '@decorators/public-route.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  
  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body() loginDto: RefreshDto) {
    return await this.authService.refresh(loginDto);
  }
}
