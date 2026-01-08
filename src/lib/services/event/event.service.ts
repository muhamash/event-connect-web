"use server"

import prisma from "@/lib/config/db/prisma.db";
import { EventStatus } from "@/lib/constants/enum.constant";
import { resolveDateRange } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth/auth.option";
import { CreateEventPayload, EventFormValues, GetAllEventsOptions, GetEventsOptionsOnUserEvents } from "./event.type";


export async function createEvent(
  payload: CreateEventPayload,
  hostId: string
) {
  if (!hostId) {
    throw new Error("Unauthorized: Host not found");
  }


  if (payload.maxParticipants < 5) {
    throw new Error("Minimum participants must be at least 5");
  }

  // Ensure date is future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (payload.date <= today) {
    throw new Error("Event date must be in the future");
  }

  try {
    const event = await prisma.event.create({
      data: {
        hostId,

        title: payload.title,
        category: payload.category,
        description: payload.description,
        image: payload.image ?? null,

        date: payload.date,
        time: payload.time,
        location: payload.location,

        maxParticipants: payload.maxParticipants,
        joiningFee: payload.joiningFee ?? 0,

        status: EventStatus.OPEN,
      },
    });

    revalidatePath("/events");


      return {
          success: true,
          event,
          message: "Event created!"
      };
  } catch (error: any) {
    console.error("CREATE_EVENT_ERROR", error);
    throw new Error("Failed to create event");
  }
};

export async function getEventForTheUserBasedOnRole({
  role,
  userId,
  page = 1,
  limit = 3,
  category,
  status,
  search,
}: GetEventsOptionsOnUserEvents) {
    try
    {
      console.log(role,
  userId,
  page ,
  limit ,
  category,
  status,
  search)
    if (!userId) {
      return {
        message: "User ID is required",
        success: false,
        data: { events: [], pagination: {} },
      };
    }

    const skip = (page - 1) * limit;
    let events: any[] = [];
    let total = 0;

    if (role?.toLowerCase() === "host") {
      // Filters for hosted events
      const hostFilters: any = {};
      if (category) hostFilters.category = category;
      if (status) hostFilters.status = status;
      if (search && typeof search === "string") {
        hostFilters.title = { contains: search, mode: "insensitive" };
      }

      // Count total hosted events
      total = await prisma.event.count({
        where: {
          hostId: userId,
          ...hostFilters,
        },
      });

      // Fetch hosted events with participants
      events = await prisma.event.findMany({
        where: {
          hostId: userId,
          ...hostFilters,
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          participants: true,
          host: true,
          reviews: true
        },
      });
    } else {
      // Filters for participant events
      const eventFilters: any[] = [];
      if (category) eventFilters.push({ category });
      if (status) eventFilters.push({ status });
      if (search && typeof search === "string") {
        eventFilters.push({ title: { contains: search, mode: "insensitive" } });
      }

      const participantWhere = {
        userId,
        event: eventFilters.length > 0 ? { AND: eventFilters } : {},
      };

      // Count total joined events
      total = await prisma.participant.count({ where: participantWhere });

      // Fetch participant events with host & participants
      const participants = await prisma.participant.findMany({
        where: participantWhere,
        skip,
        take: limit,
        include: {
          event: {
            include: {
              host: true,
              participants: true,
            },
          },
        },
      });

      // Extract events from participants
      events = participants.map((p) => p.event);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      message: "Fetched",
      success: true,
      data: {
        events,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    };
    }
    catch ( error: any )
    {
    console.error("Error fetching events:", error);
    return {
      message: "Error fetching events",
      success: false,
      data: {
        events: [],
        pagination: {},
      },
    };
  }
};

export async function getAllEvents({
  page = 1,
  limit = 3,
  category,
  dateRange,
  location,
  search,
}: GetAllEventsOptions) {
  try {
    const skip = ( page - 1 ) * limit;
    console.log( category,
      dateRange,
      location,
      search, );

    const filters: any = {};

    // Category filter
    if (category) {
      filters.category = category;
    }

    // Location filter (partial match)
    if (location) {
      filters.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Search filter (title OR description)
    if (search && typeof search === "string") {
      filters.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    filters.status = EventStatus.OPEN;

    // Date filter (single day)
    if (dateRange) {
      const range = resolveDateRange(dateRange);

      if (range) {
        filters.date = range;
      }
    }

    // Count total events
    const total = await prisma.event.count({
      where: filters,
    });

    // Fetch events
    const events = await prisma.event.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      skip,
      take: limit,
      include: {
        host: true,
        participants: true,
        reviews: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      message: "Fetched all events",
      success: true,
      data: {
        events,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    };
  }
  catch ( error: any )
  {
    console.error("Error fetching all events:", error);

    return {
      message: "Error fetching events",
      success: false,
      data: {
        events: [],
        pagination: {},
      },
    };
  }
};

export async function getEventById(eventId: string) {
  try {
    if ( !eventId || typeof eventId !== "string" )
    {
      return {
        success: false,
        message: "Event ID is required",
        data: null,
      };
    }

    const event = await prisma.event.findUnique( {
      where: { id: eventId },
      include: {
        host: {
          select: {
            id: true,
            fullname: true,
            image: true,
            rating: true,
            totalReviews: true,
          },
        },
        participants: {
          orderBy: {
            joinedAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                image: true,
              },
            },
          },
        },
      },
    } );


    if (!event) {
      return {
        success: false,
        message: "Event not found",
        data: null,
      };
    }


    return {
      success: true,
      message: "Event fetched successfully",
      data: event,
    };

  }
  catch ( error: any )
  {
    console.error("Error fetching event by ID:", error);

    return {
      success: false,
      message: "Failed to fetch event",
      data: null,
    };
  }
}

export async function updateEventAction(
  eventId: string,
  payload: EventFormValues
) {
  try {

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { hostId: true },
    });

    if (!existingEvent) {
      return { success: false, message: "Event not found" };
    }

    if (existingEvent.hostId !== session.user.id) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: payload.title,
        category: payload.category,
        description: payload.description,
        image: payload.image,
        date: payload.date,
        time: payload.time,
        location: payload.location,
        maxParticipants: payload.maxParticipants,
        joiningFee: payload.joiningFee,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/edit-event/${eventId}`);

    return {
      success: true,
      message: "Event updated successfully",
    };
  } catch (error) {
    console.error("Update Event Error:", error);
    return {
      success: false,
      message: "Something went wrong while updating event",
    };
  }
}

export async function cancelEvent(eventId: string) {
  try {
  
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!eventId || typeof eventId !== "string") {
      return {
        success: false,
        message: "Event ID is required",
      };
    }

    
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        hostId: true,
        status: true,
        date: true,
      },
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }


    if (event.hostId !== session.user.id) {
      return {
        success: false,
        message: "Forbidden: You are not the event host",
      };
    }


    if (event.status === EventStatus.CANCELLED) {
      return {
        success: false,
        message: "Event is already cancelled",
      };
    }

    if (event.status === EventStatus.COMPLETED) {
      return {
        success: false,
        message: "Completed events cannot be cancelled",
      };
    }

    const now = new Date();
    if (event.date < now) {
      return {
        success: false,
        message: "Past events cannot be cancelled",
      };
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventStatus.CANCELLED,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/edit-event/${eventId}`);

    return {
      success: true,
      message: "Event cancelled successfully",
    };
  }
  catch ( error )
  {
    console.error("Cancel Event Error:", error);
    return {
      success: false,
      message: "Something went wrong while cancelling the event",
    };
  }
}
