"use server";

import prisma from "@/lib/db/prisma.db";
import bcrypt from "bcryptjs";
import { RegisterSchemaType } from "./auth.type";


export const createUser = async ( payload: RegisterSchemaType ) =>
{

    const existingUser = await prisma.user.findUnique( {
        where: { email: payload.email },
    } );

    if ( existingUser )
    {
        return {
            success: false,
            message: "User with this email already exists",
        };
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number( process.env.BCRYPT_SALT_ROUNDS ) || 10
    );

    try
    {
        const user = await prisma.user.create( {
            data: {
                fullname: payload.fullname,
                email: payload.email,
                password: hashedPassword,
                role: payload.role,
            },
        } );

        const { password, ...safeUser } = user;

        return {
            success: true,
            message: "User created successfully",
            data: JSON.parse(JSON.stringify(safeUser)),
        };

    }
    catch ( error: any )
    {
        if ( error.code === "P2002" )
        {
            return {
                success: false,
                message: "Email already exists — unique constraint failed",
            };
        }

        return {
            success: false,
            message: "Failed to create user",
            error: error?.message,
        };
    }
};

