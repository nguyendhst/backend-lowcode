import { Global, Module, Provider } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { TransformInterceptor } from './interceptor/response-transform.interceptor';
import { PrismaService } from './services/prisma.service';
import { PasetoService } from './services/paseto.service';
import { JwtTokenService } from './services/jwt.service';
import { TOKEN_SERVICE } from '../constants/auth.constant';
import { SerializerInterceptor } from './interceptor/serializer.interceptor';

const providers: Provider[] = [
  ApiConfigService,
  TransformInterceptor,
  SerializerInterceptor,
  PrismaService,
  JwtTokenService,
  PasetoService,
  {
    provide: TOKEN_SERVICE,
    useFactory: (apiConfigService: ApiConfigService) => {
      switch (apiConfigService.authConfig.strategy) {
        case 'jwt':
          return new JwtTokenService(apiConfigService);
        case 'paseto':
          return new PasetoService(apiConfigService);
        default:
          throw new Error('Unknown strategy');
      }
    },
    inject: [ApiConfigService],
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
