import prisma from "@/lib/config/db/prisma.db";
import { stripe } from "@/lib/config/stripe/stripe.config";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {

  console.log( "this is running!!", req.headers )
  
  const sig = req.headers.get( "stripe-signature" );
  
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const bodyBuffer = await req.arrayBuffer();
  const body = Buffer.from( bodyBuffer );

  if (!body) return NextResponse.json({ error: "Empty body" }, { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(" Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const response = NextResponse.json({ received: true });

  (async () => {
    try {
      if ( event.type === "checkout.session.completed" )
      {
        
        const session = event.data.object as Stripe.Checkout.Session;
        console.log( session );

        if (session.payment_status !== "paid") return;

        // Validate metadata
        const metadata = session.metadata || {};
        const eventId = metadata.eventId;
        const userId = metadata.userId;
        if (!eventId || !userId) {
          console.warn(" Missing metadata in session:", session.id);
          return;
        }

        // Prisma transaction
        await prisma.$transaction(async (tx) => {
          // Prevent duplicate payments
          const existingPayment = await tx.payment.findUnique({ where: { txnId: session.id } });
          if (existingPayment) return;

          await tx.payment.create({
            data: {
              eventId,
              userId,
              amount: session.amount_total ?? 0,
              provider: "STRIPE",
              status: "SUCCESS",
              txnId: session.id,
            },
          });

          await tx.participant.create({ data: { eventId, userId } });
          await tx.user.update({
            where: { id: userId },
            data: { eventsAttended: { increment: 1 } },
          });
        });

        console.log(` Payment processed for session: ${session.id}, user: ${userId}`);
      }
    } catch (err) {
      console.error(" DB transaction failed:", err);
    }
  })();

  return response;
}