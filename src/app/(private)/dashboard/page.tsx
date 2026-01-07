import Dashboard from "@/components/modules/dashboard/DashboardContainer";
import DashboardSkeleton from "@/components/skeletons/DashBoardSkelton";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getEventForTheUserBasedOnRole } from "@/lib/services/event/event.service";
import { normalizeParam } from "@/lib/utils";
import { RouteSearchParams } from "@/types/pages.type";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Dashboard | EventConnect',
  description: 'Enjoy  dashboard ...',
}

interface DashboardProps
{
  searchParams: RouteSearchParams;
  
}

export default async function DashboardPage ({searchParams}:DashboardProps)
{
  const getSearchParams = await searchParams;
  const sessionUser = await getServerSession( authOptions );

  const eventsPromise = getEventForTheUserBasedOnRole(
    {
      role: sessionUser?.user?.role,
      userId: sessionUser?.user?.id,
      page: Number( normalizeParam( getSearchParams?.page ) ) || 1,
      status: normalizeParam( "OPEN"),
    }
  );

  // console.log(sessionUser?.user)
  return (
    <Suspense fallback={<DashboardSkeleton/>}>
      <Dashboard eventsPromise={eventsPromise} fullname={sessionUser?.user?.fullname} role={sessionUser?.user?.role} userId={ sessionUser?.user?.id } />
    </Suspense>
  )
}
