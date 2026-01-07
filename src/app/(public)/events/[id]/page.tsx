import EventDetails from "@/components/modules/events/EventDetailsContainer";
import EventDetailsSkeleton from "@/components/skeletons/EventDetailsContainer";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getEventById } from "@/lib/services/event/event.service";
import { RouteParams } from "@/types/pages.type";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";


export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const getParams = await params;

  const eventResponse = await getEventById(getParams?.id);

  if (!eventResponse.success || !eventResponse.data) {
    return {
      title: "Event not found",
      description: "This event does not exist or has been removed.",
    };
  }

  const event = eventResponse.data;

  return {
    title: `${event.title} | EventConnect`,
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


export default async function EventDetailsPage ({
  params,
}: RouteParams )
{
  const getParams = await params;
  const getEvent = getEventById( getParams?.id )
  const sessionUser = await getServerSession( authOptions );
  // console.log( getParams?.id, getEvent )
  

  return (
    <Suspense fallback={<EventDetailsSkeleton/>}>
      <EventDetails sessionRole={sessionUser?.user?.role} eventPromise={ getEvent } />
    </Suspense>
  )
}
