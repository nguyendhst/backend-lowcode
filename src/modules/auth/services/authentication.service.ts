import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { UserDTO } from '@dtos/user.dto';
import { ApiConfigService } from '@shared/services/api-config.service';
import { AuthPayloadDto, RefreshDto } from '@dtos/auth.dto';
import { PasetoService } from '@shared/services/paseto.service';

@Injectable()
export class AuthenticationService {
  async refresh(refreshDto: RefreshDto) {
    if (this.apiConfigService.authConfig.strategy === 'paseto') {
      try {
        const verifyToken = await this.pasetoService.verifyToken(refreshDto.RefreshToken);

        const user = await this.userService.getUserByEmail(verifyToken.email);

        if (!user) {
          throw new ForbiddenException('User not found');
        }

        const payload = {
          id: user.id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,

          // at rt from google
          accessToken: verifyToken.accessToken,
          refreshToken: verifyToken.refreshToken,
        }

        const [newAt,newRt] = [
          await this.generatePASETOAccessToken(payload),
          await this.generatePASETORefreshToken(payload)
        ] 
    
        return [newAt, newRt];

      } catch (error) {
        throw new ForbiddenException(error.message);
      }
    }

    return 'refresh token jwt';

  }

  constructor(
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
    private readonly jwtService: JwtService,
    private readonly pasetoService: PasetoService,
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

  async login(user: AuthPayloadDto): Promise<[string, string]> {
    const payload = { 
      ...user
    };

    return [
      await this.generatePASETOAccessToken(payload),
      await this.generatePASETORefreshToken(payload),
    ];
  }

  private async generateJWTAccessToken(payload: AuthPayloadDto): Promise<string> {
    // if use this must encrypt the at, rt in payload

    return this.jwtService.signAsync(payload, {
      secret: `${this.apiConfigService.jwt.secret}access`,
      expiresIn: this.apiConfigService.jwt.accessTokenExpiresIn,
    });
  }

  private async generateJWTRefreshToken(payload: AuthPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: `${this.apiConfigService.jwt.secret}refresh`,
      expiresIn: this.apiConfigService.jwt.refreshTokenExpiresIn,
    });
  }

  private async generatePASETOAccessToken(payload: AuthPayloadDto): Promise<string> {
	return this.pasetoService.generateToken(payload, 'local');
  }

  private async generatePASETORefreshToken(payload: AuthPayloadDto): Promise<string> {
	return this.pasetoService.generateToken(payload, 'local');
  }
}
