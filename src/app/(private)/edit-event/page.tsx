import EditEvent from "@/components/modules/dashboard/EditEventContainer";
import EditEventSkeleton from "@/components/skeletons/EditEventSkeleton";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getEventById } from "@/lib/services/event/event.service";
import { normalizeParam } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { MyEventsPageProps } from "../my-events/page";


export async function generateMetadata({
  searchParams,
}: MyEventsPageProps)
{
    const getSearchParams = await searchParams;
    // const getEvent = getEventById( getSearchParams?.eventId );

   const eventResponse = await getEventById(normalizeParam(getSearchParams?.eventId));

  if (!eventResponse.success || !eventResponse.data) {
    return {
      title: "Event not found",
      description: "This event does not exist or has been removed.",
    };
  }

  const event = eventResponse.data;

  return {
    title: `Edit ${event.title} | EventConnect`,
    description: event.description.slice(0, 150), 
    keywords: [event.category, event.location, "events", "meetup"],

    openGraph: {
      title: event.title,
      description: event.description.slice(0, 150),
      type: "website",
      images: event.image ? [{ url: event.image, width: 800, height: 600 }] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.slice(0, 150),
      images: event.image ? [event.image] : [],
    },
  };
}


export default async function EditEventPage ({
  searchParams,
}: MyEventsPageProps)
{
    const getSearchParams = await searchParams;
    const getEvent = getEventById( normalizeParam( getSearchParams?.eventId ) );
    const sessionUser = await getServerSession( authOptions );

    return (
        <Suspense fallback={<EditEventSkeleton />}>
            <EditEvent eventPromise={getEvent}/>
        </Suspense>
    );
}
