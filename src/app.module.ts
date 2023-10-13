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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { JwtAuthGuard } from './guards/auth.guard';
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
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
