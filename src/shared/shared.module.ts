import { Global, Module, Provider } from "@nestjs/common";
import { ApiConfigService } from "./services/api-config.service";
import { TransformInterceptor } from "./interceptor/response-transform.interceptor";
import { PrismaService } from "./services/prisma.service";
import { PasetoService } from "./services/paseto.service";


const providers: Provider[] = [
	ApiConfigService,
	TransformInterceptor,
	PrismaService,
	PasetoService,
]

@Global()
@Module({
	providers:[...providers],
	exports: [...providers],
})

export class SharedModule {}