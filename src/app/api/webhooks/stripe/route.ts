export const runtime = "nodejs";
export const preferredRegion = "auto";


import prisma from "@/lib/config/db/prisma.db";
import { stripe } from "@/lib/config/stripe/stripe.config";
import { NextResponse } from "next/server";
import Stripe from "stripe";


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };


export async function POST ( req: Request )
{
    const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }


  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const { eventId, userId } = session.metadata!;

      try {
        await prisma.$transaction(async (tx) => {
          // prevent duplicate payment
          const existingPayment = await tx.payment.findUnique({
            where: { txnId: session.id },
          });

          if (existingPayment) return;

          await tx.payment.create({
            data: {
              eventId,
              userId,
              amount: session.amount_total!,
              provider: "STRIPE",
              status: "SUCCESS",
              txnId: session.id,
            },
          });

          await tx.participant.create({
            data: { eventId, userId },
          });

          await tx.user.update({
            where: { id: userId },
            data: { eventsAttended: { increment: 1 } },
          });
        });
      }
      catch ( err )
      {
        console.error("DB transaction failed:", err);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }
    }
  }

    console.log("from web hook api ----->>>>>>>>>>> running!!!")
  return NextResponse.json({ received: true });
};
