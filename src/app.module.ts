import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserController } from '@modules/user/controllers/user.controller';
import { AuthenticationController } from '@modules/auth/controllers/authentication.controller';
import { OAuthController } from '@modules/auth/controllers/oauth.controller';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PasetoAuthGuard } from './guards/paseto-auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ApiConfigService } from './shared/services/api-config.service';
import { SerializerInterceptor } from './shared/interceptor/serializer.interceptor';
import { GlobalExceptionFilter } from './filters/all.filter';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SharedModule,
    UserModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthenticationController,
    OAuthController,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useFactory: (
        apiConfigService: ApiConfigService,
        reflector: Reflector,
      ) => {
        switch (apiConfigService.authConfig.strategy) {
          case 'jwt':
            return new JwtAuthGuard(reflector);
          case 'paseto':
            return new PasetoAuthGuard(reflector);
          default:
            throw new Error('Unknown strategy');
        }
      },
      inject: [ApiConfigService, Reflector],
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
