import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventService } from './events.service';
import { events } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { AuthGuard } from './authorization/auth.gaurd';

@Controller()
export class AppController {
  constructor(private readonly eventService: EventService, private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @Post("events")
  createEvent(@Body() eventData: Prisma.eventsCreateInput): Promise<events> {
    return this.eventService.createEvent(eventData);
  }

  @UseGuards(AuthGuard)
  @Put("events")
  updateEvent(@Body() eventData: Prisma.eventsCreateInput): Promise<events> {
    return this.eventService.updateEvent(eventData);
  }

  @Get("events/:id")
  async getEvents(@Param() params: { id: string | null }): Promise<events[]> {
    if(params.id == null) {
      return this.prisma.events.findMany();
    }else{
      let value = await this.prisma.events.findUnique({
        where: {
          id: params.id
        }
      });
      return [value];
    }
  }
  @Get("events")
  async getAllEvents(@Param() params: { id: string | null }): Promise<events[]> {
    if(params.id == null) {
      return this.prisma.events.findMany();
    }else{
      let value = await this.prisma.events.findUnique({
        where: {
          id: params.id
        }
      });
      return [value];
    }
  }

}