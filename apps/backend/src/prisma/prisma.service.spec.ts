import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);

    jest.spyOn(service, '$connect').mockResolvedValue(undefined);
    jest.spyOn(service, '$disconnect').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    if (service) {
      await service.$disconnect();
    }
    jest.clearAllMocks();
  });

  // 1. Service is created
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 2. onModuleInit call $connect
  it('should call $connect on onModuleInit', async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValueOnce(undefined);

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  // 3. onModuleDestroy call $disconnect
  it('should call $disconnect on onModuleDestroy', async () => {
    const disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValueOnce(undefined);

    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });

  // 4. onModuleInit throw error if $connect fails
  it('should throw if $connect fails', async () => {
    jest
      .spyOn(service, '$connect')
      .mockRejectedValueOnce(new Error('Connection failed'));

    await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
  });
});
