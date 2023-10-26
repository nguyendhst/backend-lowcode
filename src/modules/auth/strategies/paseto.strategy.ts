import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { PasetoService } from '@shared/services/paseto.service';
import { AuthPayloadDto } from '@dtos/auth.dto';

@Injectable()
export class PasetoStrategy extends PassportStrategy(Strategy, 'paseto') {
  constructor(private readonly pasetoService: PasetoService) {
    super();
  }

  async validate(req: Request): Promise<AuthPayloadDto> {
    const token = await this.pasetoFromRequest(req);
    const payload = await this.verifyToken(token);
    return payload;
  }

  private async pasetoFromRequest(req: Request): Promise<string> {
    try {
      return this.extractTokenFromRequest(req);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async verifyToken(token: string): Promise<AuthPayloadDto> {
    return await this.pasetoService.verifyTokenAsync(token);
  }

  private extractTokenFromRequest(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    return authHeader.replace('Bearer ', '');
  }
}
