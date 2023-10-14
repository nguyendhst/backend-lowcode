import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from '@services/authentication.service';
import { GoogleOAuthStrategy } from '@strategies/google-oauth.strategy';
import { UserModule } from '@modules/user/user.module';
import { AuthenticationController } from '@controllers/authentication.controller';
import { SharedModule } from '@shared/shared.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OAuthController } from './controllers/oauth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiConfigService } from '@shared/services/api-config.service';
import { PasetoStrategy } from './strategies/paseto.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    PassportModule,
    SharedModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ApiConfigService],
      useFactory: async (apiConfigService: ApiConfigService) => ({
        secret: apiConfigService.jwt.secret,
        signOptions: { expiresIn: apiConfigService.jwt.expiresIn },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    GoogleOAuthStrategy,
    JwtStrategy,
    JwtService,
    PasetoStrategy,
  ],
  controllers: [AuthenticationController, OAuthController],
  exports: [AuthenticationService],
})
export class AuthModule {}
