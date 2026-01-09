"use server"

import prisma from "@/lib/config/db/prisma.db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.option";

// Get all users with pagination
export async function getAllUsers(page = 1, limit = 10, role?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", data: null };
    }

    const skip = (page - 1) * limit;
    const where = role ? { role: role as any } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullname: true,
          email: true,
          role: true,
          rating: true,
          totalReviews: true,
          eventsHosted: true,
          eventsAttended: true,
          createdAt: true,
          image: true,
          location: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("get all users error:", error);
    return { success: false, message: "Failed to fetch users", data: null };
  }
}

// Get all events with filters
export async function getAllEvents(page = 1, limit = 10, status?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", data: null };
    }

    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          host: {
            select: {
              id: true,
              fullname: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              participants: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      success: true,
      data: {
        events,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("get all events error:", error);
    return { success: false, message: "Failed to fetch events", data: null };
  }
}

// Get all participants
export async function getAllParticipants(page = 1, limit = 10) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", data: null };
    }

    const skip = (page - 1) * limit;

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({
        skip,
        take: limit,
        orderBy: { joinedAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
              image: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              date: true,
              status: true,
              host: {
                select: {
                  fullname: true,
                },
              },
            },
          },
        },
      }),
      prisma.participant.count(),
    ]);

    return {
      success: true,
      data: {
        participants,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("get all participants error:", error);
    return { success: false, message: "Failed to fetch participants", data: null };
  }
}

// Get user profile details
export async function getUserProfile(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized", data: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hostedEvents: {
          select: {
            id: true,
            title: true,
            date: true,
            status: true,
            _count: {
              select: { participants: true },
            },
          },
          orderBy: { date: "desc" },
          take: 5,
        },
        joinedEvents: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                status: true,
              },
            },
          },
          orderBy: { joinedAt: "desc" },
          take: 5,
        },
        reviewsWritten: {
          include: {
            event: {
              select: {
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                fullname: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return { success: false, message: "User not found", data: null };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("get user profile error:", error);
    return { success: false, message: "Failed to fetch user profile", data: null };
  }
}

// Update user role
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_USER_ROLE",
        target: userId,
      },
    });

    return { success: true, message: "User role updated successfully" };
  } catch (error) {
    console.error("update user role error:", error);
    return { success: false, message: "Failed to update user role" };
  }
}

// Update event status
export async function updateEventStatus(eventId: string, newStatus: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { status: newStatus as any },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_EVENT_STATUS",
        target: eventId,
      },
    });

    return { success: true, message: "Event status updated successfully" };
  } catch (error) {
    console.error("update event status error:", error);
    return { success: false, message: "Failed to update event status" };
  }
}
