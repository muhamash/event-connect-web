"use client"

import { mockEvents, mockReviews, mockUsers } from "@/components/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import
  {
    Calendar,
    CalendarDays,
    Edit,
    MapPin,
    Star,
    Ticket,
    Users
  } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use } from "react";

interface ProfileProps
{
  userPromise: Promise<any>;
  userId?: string;
}

const Profile = ( { userPromise, userId }: ProfileProps ) =>
{
 
  // console.log(userPromise)
  const userData = use( userPromise )
  console.log(userData?.data)
  
  const { id } = useParams();
  const user = mockUsers.find((u) => u.id === id) || mockUsers[0];
  const isOwnProfile = userData?.data?.id === userId; 

  const hostedEvents = mockEvents.filter((e) => e.hostId === user.id);
  const attendedEvents = mockEvents.slice(0, 3); 
  const userReviews = mockReviews;

  if (!userData || (userData as any).success === false) {
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
                      {userData?.data?.fullname?.charAt(0)}
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
                      {userData?.data?.interests?.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="border-primary/50 text-primary"
                        >
                          {interest}
                        </Badge>
                      ))}
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
                  <span className="text-2xl font-bold">{userData?.data?.eventsHosted ?? 0}</span>
                </div>
                <p className="text-muted-foreground text-sm">Events Hosted</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-accent mb-2">
                  <Ticket className="h-5 w-5" />
                  <span className="text-2xl font-bold">{userData?.data?.eventsAttended ?? 0}</span>
                </div>
                <p className="text-muted-foreground text-sm">Events Attended</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-bold">{formatDate(userData?.data?.createdAt, { withTime: false })}</span>
                </div>
                <p className="text-muted-foreground text-sm">Member Since</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Section */}
          {/* for admin no tabs, for host oka , for user only attended events */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="hosted" className="w-full">
              <TabsList className="bg-muted mb-6">
                <TabsTrigger value="hosted">Hosted Events</TabsTrigger>
                <TabsTrigger value="attended">Attended Events</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="hosted">
                {hostedEvents.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostedEvents.map((event) => (
                      <Link key={event.id} href={`/events/${event.id}`}>
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
                            <p className="text-sm text-muted-foreground">
                              {event.date}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {event.attendees}/{event.maxAttendees}
                                </span>
                              </div>
                              <span className="font-bold text-primary">
                                {event.price === 0 ? "Free" : `$${event.price}`}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="p-12 text-center">
                      <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold mb-2">No Events Hosted Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start hosting events to connect with amazing people!
                      </p>
                      <Link href="/events/create">
                        <Button className="bg-gradient-primary">
                          Create Your First Event
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="attended">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendedEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
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
                            {event.date}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <Card key={review.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback>
                              {review.userName.charAt(0)}
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
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-secondary text-secondary"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
