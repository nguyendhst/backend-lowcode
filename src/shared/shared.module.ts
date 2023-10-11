import { Global, Module, Provider } from "@nestjs/common";
import { ApiConfigService } from "./services/api-config.service";
import { TransformInterceptor } from "./interceptor/response-transform.interceptor";


const providers: Provider[] = [
	ApiConfigService,
	TransformInterceptor
]

@Global()
@Module({
	providers:[...providers],
	exports: [...providers],
})

export class SharedModule {}