import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./lib/constants/enum.constant";
import { authOptions } from "./lib/services/auth/auth.option";


export async function proxy ( request: NextRequest )
{
    const pathname = request.nextUrl.pathname;

    // const routerOwner = getRouteOwner( pathname );
    // const isAuth = isAuthRoute( pathname )
    const session = await getServerSession( authOptions );
    
    if ( pathname === "/profile/edit" && !session )
    {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if ( session && pathname === "/login" || session && pathname === "register" )
    {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // role based access
    if ( session && session?.user?.role !== UserRole.HOST && pathname === "/events/create" )
    {
        return NextResponse.redirect(new URL("/events", request.url));
    }
    
    if ( !session && pathname === "/events/create" )
    {
        return NextResponse.redirect(new URL("/events", request.url));
    }

    if ( !session && pathname === "/dashboard" || session && session?.user?.role === UserRole.USER )
    {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
}