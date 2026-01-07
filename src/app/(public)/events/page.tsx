import { MyEventsPageProps } from "@/app/(private)/my-events/page";
import Events from "@/components/modules/events/EventsContainer";
import MyEventsSkeleton from "@/components/skeletons/EventsSkeleton";
import { getAllEvents } from "@/lib/services/event/event.service";
import { normalizeParam } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Explore events | EventConnect',
  description: 'Explore, participate and enjoy!!',
}

export default async function EventsPage({
  searchParams,
}: MyEventsPageProps )
{
  const getSearchParams = await searchParams;

  const eventsPromise = getAllEvents(
    {
      page: Number( normalizeParam( getSearchParams?.page ) ) || 1,
      category: normalizeParam( getSearchParams?.category ),
      location: normalizeParam( getSearchParams?.location ),
      search: normalizeParam( getSearchParams?.search ),
      dateRange: normalizeParam(getSearchParams?.dateRange)
    }
  );

  return (
    <Suspense fallback={<MyEventsSkeleton/>}>
      <Events eventsPromise={eventsPromise }/>
    </Suspense>
  )
}