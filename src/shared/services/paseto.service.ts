import { Injectable } from '@nestjs/common';
import { V3 } from 'paseto';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class PasetoService {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  async generateToken(
    payload: any,
    purpose: 'local' | 'public',
  ): Promise<string> {
    if (purpose === 'local') {
      return await V3.encrypt(
        payload,
        this.toPrivateKey(this.apiConfigService.paseto.secret),
      );
    }
    return this.signPayload(payload);
  }

  async signPayload(payload: any): Promise<string> {
    return await V3.sign(
      payload,
      this.toPrivateKey(this.apiConfigService.paseto.secret),
    );
  }

  async verifyToken(token: string): Promise<any> {
    return await V3.decrypt(
      token,
      this.toPrivateKey(this.apiConfigService.paseto.secret),
    );
  }

  private toPrivateKey(secret: string): string {
    return secret;
  }
}
