import { authOptions } from "@/lib/services/auth/auth.option";
import { XCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CancelPage ()
{
 

  const sessionUser = await getServerSession( authOptions );
  if ( !sessionUser )
  {
    redirect("/login")
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#141414] to-black px-4">
      <div className="max-w-md w-full rounded-2xl border border-orange-500/20 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] shadow-[0_0_60px_rgba(255,120,0,0.15)] p-8 text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-orange-300 shadow-[0_0_30px_rgba(255,100,0,0.6)]">
          <XCircle className="h-10 w-10 text-black" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm text-orange-100/80">
          ❌ Your payment was cancelled.  
          No charges were made to your account.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/events"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 px-6 py-3 font-semibold text-black shadow-lg transition-all hover:scale-[1.02] hover:shadow-orange-500/40"
          >
            Browse Events
          </Link>

          <Link
            href="/my-events"
            className="inline-flex w-full items-center justify-center rounded-xl border border-orange-500/30 px-6 py-3 text-sm font-medium text-orange-300 transition hover:bg-orange-500/10"
          >
            Go to My Events
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs text-orange-100/50">
          You can retry payment anytime before the event fills up
        </p>
      </div>
    </div>
  );
}
