import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    email: string,
    name: string,
    type: UserType,
    hashPassword?: string,
    image?: string,
  ) {
    return await this.prisma.user.create({
      data: {
        email,
        name,
        type,
        hashPassword,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        type: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string, type: UserType) {
    return await this.prisma.user.findUnique({
      where: { email_type: { email, type } },
      select: {
        id: true,
        name: true,
        email: true,
        hashPassword: true,
        emailVerified: true,
        image: true,
        type: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateEmailVerification(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: { emailVerified: new Date() },
    });
  }

  async updatePassword(userId: number, newPasswordHash: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hashPassword: newPasswordHash },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
