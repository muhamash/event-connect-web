"use server"

import prisma from "../config/db/prisma.db";
import { EventStatus } from "../constants/enum.constant";


export async function updateEventStatus() {
  const now = new Date();

  // Fetch events that are not COMPLETED or CANCELLED yet
  const events = await prisma.event.findMany({
    where: {
      status: { in: [EventStatus.OPEN, EventStatus.FULL] },
    },
  });

  for (const event of events) {
    const eventDateTime = new Date(event.date);
    // Set the event time
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    if (eventDateTime <= now) {
      // Event time has passed
      await prisma.event.update({
        where: { id: event.id },
        data: { status: EventStatus.COMPLETED },
      });
      console.log(`Event ${event.title} marked as COMPLETED`);
    }
  }

  console.log("Event status update job finished");
  // await prisma.$disconnect();
}

updateEventStatus().catch( ( err ) =>
{
    console.error( err );
    prisma.$disconnect();
} );