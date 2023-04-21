import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { events, Prisma } from '@prisma/client';

@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}
    
    async createEvent(data: Prisma.eventsCreateInput): Promise<events> {
        return this.prisma.events.create({data});
    }
}