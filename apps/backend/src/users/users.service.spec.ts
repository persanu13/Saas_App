import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createData: CreateUserDto = {
      email: 'john@example.com',
      hashPassword: 'hashed_password',
      name: 'John',
    };

    it('should create a user and return it', async () => {
      const expected = {
        id: 1,
        email: 'john@example.com',
        name: 'John',
        role: 'CLIENT',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(expected);

      const result = await service.create(createData);

      expect(result).toEqual(expected);
    });
  });
});
