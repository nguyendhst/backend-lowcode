import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserDTO } from '@dtos/user.dto';

@Injectable()
export class UserService {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  
  async findByUsername(username: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
