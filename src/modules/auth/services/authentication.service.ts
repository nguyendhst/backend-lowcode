import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { UserDTO } from '@dtos/user.dto';
import { ApiConfigService } from '@shared/services/api-config.service';
import { RefreshDto } from '../../../dtos/auth.dto';

@Injectable()
export class AuthenticationService {
  async refresh(loginDto: RefreshDto) {
    try {
      const verifyToken = await this.jwtService.verifyAsync(loginDto.RefreshToken, {
        secret: `${this.apiConfigService.jwt.secret}refresh`,
      })

      if (!verifyToken) {
        throw new ForbiddenException({
          msg: "Failed to authenticate user!"
        })
      }

      delete verifyToken.exp;
      delete verifyToken.iat;
  
      const [newAt,newRt] = [
        await this.generateAccessToken(verifyToken),
        await this.generateRefreshToken(verifyToken)
      ] 
  
      return [newAt, newRt];
      
    } catch (error) {
      throw new ForbiddenException(error)
    }
  
  }
  constructor(
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserById(id: number) {
    const user = await this.userService.getUserById(id);
    return user;
  }

  async validateUser(profile: UserDTO): Promise<User> {
    const user = await this.userService.getUserByEmail(profile.email);

    if (user) {
      return user;
    }

    const newUser = await this.userService.createUser(profile);

    return newUser;
  }

  async login(user: UserDTO): Promise<[string, string]> {
    const payload = { email: user.email };

    return [
      await this.generateAccessToken(payload),
      await this.generateRefreshToken(payload),
    ];
  }

  private async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: `${this.apiConfigService.jwt.secret}access`,
      expiresIn: this.apiConfigService.jwt.accessTokenExpiresIn,
    });
  }

  private async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: `${this.apiConfigService.jwt.secret}refresh`,
      expiresIn: this.apiConfigService.jwt.refreshTokenExpiresIn,
    });
  }

  private async checkPassword(attempt: string) {
    return true;
  }
}
