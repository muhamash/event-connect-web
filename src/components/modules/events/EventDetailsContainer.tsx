"use client"

import { mockEvents, mockUsers } from "@/components/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/lib/constants/enum.constant";
import { joinFreeEvent } from "@/lib/services/checkout/checkout.service";
import { formatDate, formatTo12Hour } from "@/lib/utils";
import { motion } from "framer-motion";
import
  {
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Star,
    Users
  } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { use, useState } from "react";
import toast from "react-hot-toast";
import CheckoutButton from "../checkout/CheckoutButton";
import ShareButton from "./EventShareButton";

interface EventDetailsProps
{
  eventPromise: Promise<any>;
  sessionRole?: string;
  sessionUserId?: string;
}

const EventDetails = ( { eventPromise, sessionRole, sessionUserId }: EventDetailsProps ) =>
{
  const router = useRouter();
  const eventData = use( eventPromise );
  const [showParticipants, setShowParticipants] = useState(false);


  if ( !eventData?.success )
  {
    router?.push("/not-found")
  }

  // console.log( eventData?.data )

  const participants = eventData?.data?.participants ?? [];

  const isAlreadyJoined = participants.some(
    ( p: any ) => p.userId === sessionUserId
  );

  const isFull =
    eventData?.data &&
    eventData?.data?.participants?.length >= eventData?.data?.maxParticipants;
  
  console.log( isFull, isAlreadyJoined, eventData );

  const isUser = sessionRole === UserRole.USER;

  const handleJoinEvent = async () =>
  {
    if ( !eventData?.data?.id ) return;

    const res = await joinFreeEvent( eventData.data.id );

    if ( !res.success )
    {
      toast.error( res.message );
      return;
    }

    toast.success( res.message );
    router.refresh();
  };

  // mock
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === Number(id)) || mockEvents[0];
  const host = mockUsers.find((u) => u.id === event.hostId) || mockUsers[0];

  return (
    <div className="min-h-screen bg-background">

      <div className="pt-15 container mx-auto">
        {/* Hero Image */}
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src={eventData?.data?.image}
            alt={eventData?.data?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          {
            sessionRole !== UserRole.USER && (
              <div className="absolute top-6 left-6 flex  items-center gap-5">
                <Badge className="bg-rose-700 w-20 h-10 flex items-center justify-center">{eventData?.data?.status}</Badge>
                {/* <ShareButton /> */}
              </div>
            )
          }
          <div className="absolute top-6 right-6 flex  items-center gap-5">
            {/* <Badge>{ eventData?.data?.status }</Badge> */}
            <ShareButton />
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-card border-border shadow-card">
                  <CardContent className="p-8">
                    <Badge className="mb-4 bg-primary text-primary-foreground">
                      {eventData?.data?.category}
                    </Badge>
                    <h1 className="text-4xl font-bold mb-6 text-foreground">
                      {eventData?.data?.title}
                    </h1>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-foreground">
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Date</p>
                          <p className="text-muted-foreground">{formatDate( eventData?.data?.date, { withTime: false } ) || ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <Clock className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Time</p>
                          <p className="text-muted-foreground">{formatTo12Hour( eventData?.data?.time )}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <MapPin className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Location</p>
                          <p className="text-muted-foreground">{eventData?.data?.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <DollarSign className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Price</p>
                          <p className="text-muted-foreground">
                            {eventData?.data?.joiningFee === 0 ? "Free" : `$${ eventData?.data?.joiningFee } per person`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h2 className="text-2xl font-bold mb-4 text-foreground">About This Event</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {eventData?.data?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Host Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-foreground">Hosted By</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={eventData?.data?.host?.image} />
                        <AvatarFallback>{eventData?.data?.host?.fullname[ 0 ]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{eventData?.data?.host?.fullname}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span>{eventData?.data?.host?.rating}</span>
                          </div>
                          {/* <span>{eventData?.data?.host?.eventsHosted} events hosted</span> */}
                        </div>
                      </div>
                      <Link href={`/profile?userId=${ eventData?.data?.hostId }`}>
                        <Button variant="outline" className="border-border hover:border-primary">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Attendees */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground">
                        Attendees ({participants.length}/{eventData?.data?.maxParticipants})
                      </h3>
                      <Users onClick={() => setShowParticipants( true )} className="h-5 w-5 text-primary" />
                    </div>

                    {participants.length === 0 ? (
                      <p className="text-muted-foreground">No participants yet!</p>
                    ) : (
                      <div className="flex -space-x-2 cursor-pointer">
                        {participants.slice( 0, 5 ).map( ( p: any ) => (
                          <Avatar
                            key={p.id}
                            className="border-2 border-background"
                            
                          >
                            <AvatarImage src={p.user?.image ?? ""} />
                            <AvatarFallback>
                              {p.user?.fullname?.[ 0 ]}
                            </AvatarFallback>
                          </Avatar>
                        ) )}

                        {participants.length > 5 && (
                          <div
                            onClick={() => setShowParticipants( true )}
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-muted border-2 border-background text-sm font-semibold"
                          >
                            +{participants.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {showParticipants && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                  <div className="bg-card rounded-xl w-full max-w-md max-h-[70vh] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-lg">Participants</h3>
                      <button
                        onClick={() => setShowParticipants( false )}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
                      {participants.map( ( p: any ) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3"
                        >
                          <Avatar>
                            <AvatarImage src={p.user?.image ?? ""} />
                            <AvatarFallback>
                              {p.user?.fullname?.[ 0 ]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {p.user?.fullname}
                          </span>
                        </div>
                      ) )}
                      {
                        participants?.length === 0 && (
                          <p>No one is here!</p>
                        )
                      }
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <Card className="bg-card border-border shadow-card">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {eventData?.data?.joiningFee === 0 ? "Free" : `$${ eventData?.data?.joiningFee }`}
                      </div>
                      <p className="text-muted-foreground">per person</p>
                    </div>

                    {isUser && eventData?.data && !isAlreadyJoined && (
                      <>
                        {!isFull ? (
                          eventData.data.joiningFee === 0 ? (
                            <Button
                              size="lg"
                              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow mb-4"
                              onClick={handleJoinEvent}
                            >
                              Join Event (Free)
                            </Button>
                          ) : (
                            <CheckoutButton eventId={ eventData?.data?.id }/>
                          )
                        ) : (
                          <Button
                            size="lg"
                            disabled
                            className="w-full mb-4 cursor-not-allowed bg-muted text-muted-foreground"
                          >
                            Event Full
                          </Button>
                        )}
                      </>
                    )}

                    {isAlreadyJoined && (
                      <Button
                        size="lg"
                        disabled
                        className="w-full mb-4 bg-muted text-muted-foreground cursor-not-allowed"
                      >
                        You have already joined
                      </Button>
                    )}


                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Spots left</span>
                        <span className="font-semibold text-foreground">
                          {eventData?.data?.maxParticipants - eventData?.data?.participants?.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-semibold text-foreground">
                            {event.rating} ({host.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="py-12" />
      </div>

    </div>
  );
};

export default EventDetails;