import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  create(
    user: Required<Omit<User, User['id'] & User['uuid'] & Date>>, //TODO: create a Dto for clearer typing
  ): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async findByUsername(username: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
