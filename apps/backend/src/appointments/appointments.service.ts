import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto, bookedById: number) {
    const services = await this.prisma.service.findMany({
      where: { id: { in: createAppointmentDto.serviceIds } },
      select: { id: true, durationMin: true },
    });

    if (services.length !== createAppointmentDto.serviceIds.length) {
      throw new BadRequestException('One or more services do not exist');
    }

    const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);
    const endMin = createAppointmentDto.startMin + totalDuration;

    return this.prisma.appointment.create({
      data: {
        memberId: createAppointmentDto.memberId,
        bookedById,
        clientId: createAppointmentDto.clientId,
        clientName: createAppointmentDto.clientName,
        clientPhone: createAppointmentDto.clientPhone,
        date: new Date(createAppointmentDto.date),
        startMin: createAppointmentDto.startMin,
        endMin,
        notes: createAppointmentDto.notes,
        services: {
          create: services.map((s) => ({ serviceId: s.id })),
        },
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        member: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        client: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
