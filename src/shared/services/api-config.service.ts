import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import {
  AppConfig,
  DatabaseConfig,
  OAuth,
  OAuthGoogle,
} from '@interfaces/configuration.interface';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch (error) {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch (error) {
      throw new Error(key + ' environment variable is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get app(): AppConfig {
    return {
      port: this.getNumber('PORT'),
    };
  }

  get database(): DatabaseConfig {
    return {
      host: this.getString('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      uri: this.getString('DATABASE_URI'),
    };
  }

  get oauth(): OAuth {
    return {
      google: this.getOAuthGoogle(),
    };
  }

  private getOAuthGoogle(): OAuthGoogle {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
      redirectUri: this.getString('GOOGLE_REDIRECT_URI'),
    };
  }
}
