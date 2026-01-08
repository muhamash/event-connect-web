"use server";

import prisma from "@/lib/config/db/prisma.db";
import { EventStatus } from "@/lib/constants/enum.constant";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getServerSession } from "next-auth";

export const joinFreeEvent = async ( eventId: string ) =>
{
    if ( !eventId )
    {
        return {
            success: false,
            message: "Event ID is required",
        };
    }

    const session = await getServerSession( authOptions );

    if ( !session?.user?.id )
    {
        return {
            success: false,
            message: "Unauthorized",
        };
    }

    const userId = session.user.id;

    try
    {
        /* ---------------------------------------------
           1️⃣ Fetch event + validations (NO transaction)
        ---------------------------------------------- */
        const event = await prisma.event.findUnique( {
            where: { id: eventId },
            include: {
                _count: {
                    select: { participants: true },
                },
            },
        } );

        if ( !event )
        {
            return { success: false, message: "Event not found" };
        }

        if ( event.status !== EventStatus.OPEN )
        {
            return { success: false, message: "Event is not open for joining" };
        }

        if ( event.joiningFee > 0 )
        {
            return { success: false, message: "This event requires payment" };
        }

        if ( event.hostId === userId )
        {
            return { success: false, message: "Host cannot join their own event" };
        }

        if ( event.date < new Date() )
        {
            return { success: false, message: "Event has already ended" };
        }

        if ( event._count.participants >= event.maxParticipants )
        {
            return { success: false, message: "Event is already full" };
        }

        const alreadyJoined = await prisma.participant.findUnique( {
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        } );

        if ( alreadyJoined )
        {
            return {
                success: false,
                message: "You have already joined this event",
            };
        }

        /* ---------------------------------------------
           2️⃣ Atomic write operations (SHORT transaction)
        ---------------------------------------------- */
        await prisma.$transaction( [
            prisma.participant.create( {
                data: {
                    eventId,
                    userId,
                },
            } ),

            prisma.user.update( {
                where: { id: userId },
                data: {
                    eventsAttended: {
                        increment: 1,
                    },
                },
            } ),
        ] );

        return {
            success: true,
            message: "Successfully joined the event",
        };
    } catch ( error: any )
    {
        console.error( "Join free event error:", error );

        return {
            success: false,
            message: "Failed to join event",
        };
    }
};