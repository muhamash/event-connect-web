"use client"

import { mockReviews, mockUsers } from "@/components/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventStatus, UserRole } from "@/lib/constants/enum.constant";
import { formatDate, shuffleArray } from "@/lib/utils";
import { motion } from "framer-motion";
import
  {
    Calendar,
    CalendarDays,
    Edit,
    Locate,
    MapPin,
    Star,
    Ticket
  } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use } from "react";

interface ProfileProps
{
  userPromise: Promise<any>;
  sessionUser?: string;
}

const Profile = ( { userPromise, sessionUser }: ProfileProps ) =>
{
 
  console.log( sessionUser )
  const userData = use( userPromise )
  console.log( userData?.data )
  
  const { id } = useParams();
  const user = mockUsers.find( ( u ) => u.id === id ) || mockUsers[ 0 ];
  const isOwnProfile = userData?.data?.id === sessionUser;

  const hostedEventsCompleted = userData?.data?.hostedEvents?.filter( ( e ) => e.status === EventStatus.COMPLETED );

  const randomJoinedEvents = shuffleArray( userData?.data?.joinedEvents ?? [] );

  const userReviews = mockReviews;

  if ( !userData || ( userData as any ).success === false )
  {
    return <div className="text-center py-20 text-rose-700 font-bold uppercase">User not found</div>;
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <Card className="bg-card border-border overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
              <CardContent className="p-6 -mt-16">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-glow">
                    <AvatarImage src={userData?.data?.image} alt={userData?.data?.fullname} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                      {userData?.data?.fullname?.charAt( 0 )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          {userData?.data?.fullname}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground my-1">
                          <MapPin className="h-4 w-4" />
                          <span>{userData?.data?.location ?? "N/A"}</span>
                        </div>
                      </div>
                      
                    </div>

                    <p className="text-muted-foreground max-w-2xl mb-4">
                      {userData?.data?.bio ?? "Bio is empty"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {
                        userData?.data?.interests?.length === 0 && (
                          <p>N/A</p>
                        )
                      }
                      {userData?.data?.interests?.map( ( interest ) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="border-primary/50 text-primary"
                        >
                          {interest}
                        </Badge>
                      ) )}
                    </div>
                  </div>

                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <Link href="/profile/edit">
                        <Button variant="outline" className="border-border">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                      
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {
              userData?.data?.role === UserRole.HOST && (
                <>
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-primary mb-2">
                        <Star className="h-5 w-5 fill-primary" />
                        <span className="text-2xl font-bold">{userData?.data?.rating ?? 0}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {userData?.data?.totalReviews ?? 0} reviews
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-secondary mb-2">
                        <CalendarDays className="h-5 w-5" />
                        <span className="text-2xl font-bold">{userData?.data?.hostedEvents?.length ?? 0}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">Events Hosted</p>
                    </CardContent>
                  </Card>
                </>
              )
            }

            {
              userData?.dat?.role === UserRole.USER && (
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-accent mb-2">
                      <Ticket className="h-5 w-5" />
                      <span className="text-2xl font-bold">{userData?.data?.eventsAttended ?? 0}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">Events Attended</p>
                  </CardContent>
                </Card>
              )
            }

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-bold">{formatDate( userData?.data?.createdAt, { withTime: false } )}</span>
                </div>
                <p className="text-muted-foreground text-sm">Member Since</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Section */}
          {/* for admin no tabs, for host oka , for user only attended events */}
          {
            userData?.data?.role !== UserRole.ADMIN && (
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Tabs defaultValue={userData?.data?.role === UserRole.HOST ? "hosted" : "attended"} className="w-full">
                  <TabsList className="bg-muted mb-6 relative">
                    {
                      userData?.data?.role === UserRole.HOST && (
                        <>
                          <TabsTrigger value="hosted">Hosted Events</TabsTrigger>
                          <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </>
                      )
                    }
                    {
                      userData?.data?.role === UserRole.USER && (
                        <TabsTrigger value="attended">Attended Events</TabsTrigger>
                      )
                    }
                    
                  </TabsList>

                  <TabsContent value="hosted">
                    {hostedEventsCompleted?.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostedEventsCompleted?.slice( 0, 2 ).map( ( event ) => (
                          <Link key={event.id} href={`/events/${ event.id }`}>
                            <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden h-full">
                              <div className="relative h-40 overflow-hidden">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <Badge className="absolute top-3 right-3 bg-primary">
                                  {event.category}
                                </Badge>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                  {event.title}
                                </h3>
                                <div className="flex w-full justify-between items-center my-2">
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate( event.date, { withTime: false } )}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{event?.time}</p>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-1">
                                    <Locate className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{event.location}</span>
                                  </div>
                                  <span className="font-bold text-primary">
                                    {event.joiningFee === 0 ? "Free" : `$${ event.joiningFee }`}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ) )}

                        {/* View All Card */}
                        <Link href="/my-events">
                          <Card className="flex items-center justify-center border-border border-dashed hover:border-primary/50 transition-all h-full cursor-pointer">
                            <Button
                              variant="outline"
                              className="w-full h-full rounded-none text-primary hover:bg-primary/5 hover:text-white"
                            >
                              View All
                            </Button>
                          </Card>
                        </Link>
                      </div>

                    ) : (
                      <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-xl font-bold mb-2">No  {EventStatus.COMPLETED} Events Hosted Yet</h3>
                          
                          {
                            isOwnProfile && (
                              <Link href="/events/create">
                                <Button className="bg-gradient-primary">
                                  Create Your Event
                                </Button>
                              </Link>
                            )
                          }
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {
                    userData?.data?.role === UserRole.USER && (
                      <TabsContent className="relative" value="attended">
                        <Link className="bg-amber-500 text-white px-3 py-2 rounded-md shadow absolute -top-18 right-0" href={"/my-events"}>View all</Link>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {randomJoinedEvents?.slice(0,3)?.map( ( { event } ) => (
                            <Link key={event.id} href={`/events/${ event.id }`}>
                              <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden">
                                <div className="relative h-40 overflow-hidden">
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                                    Attended
                                  </Badge>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate( event.date, { withTime: false } )} {event.time && ` • ${ event.time }`}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ) )}
                          {
                            randomJoinedEvents?.length === 0 && (
                              <p>No joined event found!</p>
                            )
                          }
                        </div>
                      </TabsContent>
                    )
                  }


                  <TabsContent value="reviews">
                    <div className="space-y-4">
                      {userReviews.map( ( review ) => (
                        <Card key={review.id} className="bg-card border-border">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.userAvatar} />
                                <AvatarFallback>
                                  {review.userName.charAt( 0 )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold text-foreground">
                                      {review.userName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {review.date}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[ ...Array( 5 ) ].map( ( _, i ) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${ i < review.rating
                                          ? "fill-secondary text-secondary"
                                          : "text-muted"
                                          }`}
                                      />
                                    ) )}
                                  </div>
                                </div>
                                <p className="text-muted-foreground">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) )}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
