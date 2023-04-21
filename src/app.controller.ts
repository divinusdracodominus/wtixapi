import { Controller, Get, Post, Body } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventService } from './events.service';
import { events } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly eventService: EventService) {}

  @Post("events")
  createEvent(@Body() eventData: Prisma.eventsCreateInput): Promise<events> {
    return this.eventService.createEvent(eventData);
  }
}
