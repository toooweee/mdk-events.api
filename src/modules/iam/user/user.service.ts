import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/infra/prisma/prisma.service';
import { CreateUserDto } from '@/src/modules/iam/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findOneWithPassword(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  async findOne(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptions: {
          select: {
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }
}
