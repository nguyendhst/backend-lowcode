import {
  Controller,
  Get,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '@services/authentication.service';
import { Public } from '@decorators/public-route.decorator';
import { RedirectingExceptionFilter } from '@filters/redirect-filter';
import { TokenSuccessResponse } from '@dtos/auth.dto';
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly authService: AuthenticationService,
  ) {}

  @Get('google')
  @Public()
  @UseFilters(RedirectingExceptionFilter)
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Res() res) {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req): Promise<TokenSuccessResponse> {
    const user = req.user;
    const tokens: [string, string] = await this.authService.login(user);

    return {
      AccessToken: tokens[0],
      RefreshToken: tokens[1],
    };
  }
}
