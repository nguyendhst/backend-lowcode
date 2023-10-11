import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { LoginDto, RefreshDto } from '@dtos/auth.dto';

@Injectable()
export class AuthenticationService {
  findOrCreateGoogleUser(profile: any) {
    throw new Error('Method not implemented.');
  }
  refresh(loginDto: RefreshDto) {
    throw new Error('Method not implemented.');
  }
  async generateToken(user: User) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findByUsername(username);
    if (user && (await this.checkPassword(password))) {
      return user;
    }
    return null;
  }

  async login(payload: LoginDto) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const createdUser = await this.userService.create(user);
    const payload = {
      username: `${createdUser.firstName}${createdUser.lastName}`, // TODO: consider a better username format
      sub: createdUser.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async checkPassword(attempt: string) {
    return true;
  }
}
