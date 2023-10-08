import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}