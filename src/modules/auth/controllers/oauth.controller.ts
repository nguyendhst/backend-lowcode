import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '@services/authentication.service';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Public } from '@decorators/public-route.decorator';
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    const user = req.user;
    console.log(JSON.stringify(user));
    const tokens: [string, string] = await this.authService.login(user);

    // redirect to frontend
    const urlParams = new URLSearchParams();
    urlParams.append('accessToken', tokens[0]);
    urlParams.append('refreshToken', tokens[1]);

    res.redirect(
      this.apiConfigService.oauth.clientUrl + '/auth/success?' + urlParams.toString(),
    );
  }
}
