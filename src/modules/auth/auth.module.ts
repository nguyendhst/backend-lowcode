import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from '@services/authentication.service';
import { GoogleOAuthStrategy } from '@strategies/google-oauth.strategy';
import { UserModule } from '@modules/user/user.module';
import { AuthenticationController } from '@controllers/authentication.controller';
import { SharedModule } from '@shared/shared.module';
import { OAuthController } from './controllers/oauth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasetoStrategy } from './strategies/paseto.strategy';
import { CustomGoogleStrategy } from './strategies/google-oauth-custom.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    PassportModule,
    SharedModule,
  ],
  providers: [
    AuthenticationService,
    GoogleOAuthStrategy,
	CustomGoogleStrategy,
    JwtStrategy,
    PasetoStrategy,
  ],
  controllers: [AuthenticationController, OAuthController],
  exports: [AuthenticationService],
})
export class AuthModule {}
