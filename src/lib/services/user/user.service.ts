"use server"

import prisma from "@/lib/config/db/prisma.db";



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
                joinedEvents: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                image: true,
                                date: true,
                                time: true,
                                location: true,
                                status: true,
                            },
                        },
                    },
                },

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
            data: JSON.parse( JSON.stringify( existingUser ) )
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

export const updateUserById = async (
    id: string,
    data: {
        fullname?: string;
        bio?: string;
        location?: string;
        interests?: string[];
        image?: string; 
    }
) =>
{
    try
    {
        if ( !data )
        {
            return { success: false, message: "provide editable data" };
        }

        const checkUser = await prisma.user.findUnique( {
            where: {
                id
            }
        } );

        if ( !checkUser )
        {
            return { success: false, message: "user not found!!" };
        }

        const updatedUser = await prisma.user.update( {
            where: { id },
            data: {
                fullname: data.fullname,
                bio: data.bio,
                location: data.location,
                interests: data.interests,
                image: data.image, 
            },
            select: {
                id: true,
                fullname: true,
                bio: true,
                location: true,
                interests: true,
                image: true,
                email: true,
            },
        } );

        return { success: true, message: "user updated!", data: JSON.parse(JSON.stringify(updatedUser)) };
    } catch ( error: any )
    {
        console.log(error)
        return { success: false, message: error?.message || "Update failed" };
    }
};