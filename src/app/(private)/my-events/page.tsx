import MyEventsContainer from "@/components/modules/events/MyEventsContainer";
import MyEventsSkeleton from "@/components/skeletons/EventsSkeleton";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getEventForTheUserBasedOnRole } from "@/lib/services/event/event.service";
import { normalizeParam } from "@/lib/utils";
import { RouteSearchParams } from "@/types/pages.type";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: 'Your events | EventConnect',
  description: 'Enjoy  events ...',
}

export interface MyEventsPageProps
{
    searchParams: RouteSearchParams;
}

const MyEventsPage = async ({
  searchParams,
}: MyEventsPageProps) =>
{
    const getSearchParams = await searchParams;
    const sessionUser = await getServerSession( authOptions );

    const eventsPromise = getEventForTheUserBasedOnRole(
        {
            role: sessionUser?.user?.role,
            userId: sessionUser?.user?.id,
            page: Number( normalizeParam( getSearchParams?.page ) ) || 1,
            category: normalizeParam( getSearchParams?.category ),
            status: normalizeParam( getSearchParams?.status ),
            search: normalizeParam( getSearchParams?.search ),
        }
    );
    
    // console.log(sessionUser?.user?.role, sessionUser?.user?.id,getSearchParams )


    return (
        <Suspense fallback={<MyEventsSkeleton/>}>
            <MyEventsContainer eventsPromise={eventsPromise } />
        </Suspense>
    );
};

export default MyEventsPage;