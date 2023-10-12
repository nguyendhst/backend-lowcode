import { Global, Module, Provider } from "@nestjs/common";
import { ApiConfigService } from "./services/api-config.service";
import { TransformInterceptor } from "./interceptor/response-transform.interceptor";
import { PrismaService } from "./services/prisma.service";


const providers: Provider[] = [
	ApiConfigService,
	TransformInterceptor,
	PrismaService,
]

@Global()
@Module({
	providers:[...providers],
	exports: [...providers],
})

export class SharedModule {}