import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { database_config } from '@configs/configuration.config';
import { ExampleModule } from '@modules/example/example.module';
@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [database_config], 
    }),
    ExampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
