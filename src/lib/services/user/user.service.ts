"use server"

import prisma from "@/lib/db/prisma.db";



export const getUserInfoById = async ( id: string ) =>
{
    try
    {
        const existingUser = await prisma.user.findUnique( {
            where: {
                id
            },
            include: {
                hostedEvents: true,
                joinedEvents: true,
                reviewsReceived: true,
                reviewsWritten: true,
                // password: false
                // payments
            },
           
        } )
    
        if ( !existingUser )
        {
            return {
                success: false,
                message: "User not found",
            };
        }

        return {
            success: true,
            message: "User fetched",
            data : JSON.parse(JSON.stringify(existingUser))
        }
    }
    catch ( error: any )
    {
        return {
            success: false,
            message: "Failed to fetch user",
            error: error?.message,
        };
    }
};

