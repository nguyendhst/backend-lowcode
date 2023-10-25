import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '@services/authentication.service';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Public } from '@decorators/public-route.decorator';
import { RedirectingExceptionFilter } from '@filters/redirect-filter';
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get('google')
  @Public()
  @UseFilters(RedirectingExceptionFilter)
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Res() res) {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    const user = req.user;
    const tokens: [string, string] = await this.authService.login(user);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader(
    //  'Location',
    //  `${this.apiConfigService.appWeb.clientUrl}/api/auth?success=1`,
    //);
    res.status(HttpStatus.OK).send(tokens);
  }
}
