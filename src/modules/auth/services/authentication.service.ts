import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '@services/user.service';
import { LoginDto, RefreshDto } from '@dtos/auth.dto';
import { UserDTO } from '@dtos/user.dto';

@Injectable()
export class AuthenticationService {
  async findOrCreateGoogleUser(profile: any) {
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

  async findUserById(id: number) {
    const user = await this.userService.getUserById(id);
    return user;
  }

  async validateUser(profile: UserDTO): Promise<User> {
    console.log(profile)

    const user: User = await this.userService.getUserByEmail(profile.email);

    if (user) return user;

    const newUser = await this.userService.createUser(profile);

    console.log("new user:" + newUser);

    return newUser || null;
  }

  private async checkPassword(attempt: string) {
    return true;
  }
}
