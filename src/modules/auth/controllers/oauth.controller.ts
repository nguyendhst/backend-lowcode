import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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

	res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK).send(tokens);
  }
}
