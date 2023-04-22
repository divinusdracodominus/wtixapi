import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { events, Prisma } from '@prisma/client';
//import { IntFieldUpdateOperationsInput } from '@prisma/client';

function convertID(value: number | Prisma.IntFieldUpdateOperationsInput): number {
    let eventid: number = 0;
    if (typeof(value) == 'number') {
        eventid = value;
    }else{
        eventid = value. set;
    }
    return eventid;
}

function convertUUID(value: string | Prisma.StringFieldUpdateOperationsInput): string {
    let id: string;
    if(typeof(value) == 'string') {
        id = value;
    }else{
        id = value.set;
    }
    return id;
}

@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}
    
    async createEvent(data: Prisma.eventsCreateInput): Promise<events> {
        return this.prisma.events.create({data});
    }

    async updateEvent(data: Prisma.eventsUncheckedUpdateInput): Promise<events> {
        
        return this.prisma.events.update({ 
            where: { 
                id: convertUUID(data.id)
            },
            data: data
        });
    }

}