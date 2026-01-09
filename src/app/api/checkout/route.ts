import prisma from "@/lib/config/db/prisma.db";
import { stripe } from "@/lib/config/stripe/stripe.config";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const session = await getServerSession( authOptions );
    
    // console.group(session)
    if ( !session?.user?.id )
        return NextResponse.json( { message: "Unauthorized" }, { status: 401 } );

    const { eventId } = await req.json();;

    const event = await prisma.event.findUnique( { where: { id: eventId } } );
    
    if ( !event || !event.joiningFee )
        return NextResponse.json( { message: "Invalid event" }, { status: 400 } );

    const checkoutSession = await stripe.checkout.sessions.create( {
        payment_method_types: [ "card" ],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: event.joiningFee * 100,
                    product_data: { name: event.title },
                },
                quantity: 1,
            },
        ],
        success_url: `${ process.env.NEXT_PUBLIC_APP_URL }/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ process.env.NEXT_PUBLIC_APP_URL }/payment/cancel`,
        metadata: {
            eventId,
            userId: session.user.id,
        },
    } );

    return NextResponse.json( { url: checkoutSession.url } );
};