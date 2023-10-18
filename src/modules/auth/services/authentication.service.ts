import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { UserDTO } from '@dtos/user.dto';
import { ApiConfigService } from '@shared/services/api-config.service';
import { AuthPayloadDto, RefreshDto } from '@dtos/auth.dto';
import { TOKEN_SERVICE } from '@constants/auth.constant';
import { ITokenService } from '@interfaces/token-service.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
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
      ...user,
    };

    return [
      await this.tokenService.generateAccessTokenAsync(payload),
      await this.tokenService.generateRefreshTokenAsync(payload),
    ];
  }

  async refresh(refreshDto: RefreshDto) {
    if (this.apiConfigService.authConfig.strategy === 'paseto') {
      try {
        const verifyToken = await this.tokenService.verifyTokenAsync(
          refreshDto.RefreshToken,
        );

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
        };

        const [newAt, newRt] = [
          await this.tokenService.generateAccessTokenAsync(payload),
          await this.tokenService.generateRefreshTokenAsync(payload),
        ];

        return [newAt, newRt];
      } catch (error) {
        throw new ForbiddenException(error.message);
      }
    }

    return 'refresh token jwt';
  }
}
