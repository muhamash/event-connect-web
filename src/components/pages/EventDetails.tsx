import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  DollarSign,
  Share2,
  Heart,
} from "lucide-react";
import { mockEvents, mockUsers } from "@/data/mockData";

const EventDetails = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === Number(id)) || mockEvents[0];
  const host = mockUsers.find((u) => u.id === event.hostId) || mockUsers[0];

  // Generate mock attendees list
  const attendeesList = mockUsers.slice(0, Math.min(event.attendees, 4));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <Share2 className="h-5 w-5" />
            </Button>
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
                      {event.category}
                    </Badge>
                    <h1 className="text-4xl font-bold mb-6 text-foreground">
                      {event.title}
                    </h1>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-foreground">
                        <Calendar className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Date</p>
                          <p className="text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <Clock className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Time</p>
                          <p className="text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <MapPin className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Location</p>
                          <p className="text-muted-foreground">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-foreground">
                        <DollarSign className="h-5 w-5 mr-3 text-primary" />
                        <div>
                          <p className="font-semibold">Price</p>
                          <p className="text-muted-foreground">
                            {event.price === 0 ? "Free" : `$${event.price} per person`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h2 className="text-2xl font-bold mb-4 text-foreground">About This Event</h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
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
                        <AvatarImage src={host.avatar} />
                        <AvatarFallback>{host.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{host.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span>{host.rating}</span>
                          </div>
                          <span>{host.eventsHosted} events hosted</span>
                        </div>
                      </div>
                      <Link to={`/profile/${host.id}`}>
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
                        Attendees ({event.attendees}/{event.maxAttendees})
                      </h3>
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex -space-x-2">
                      {attendeesList.map((attendee, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {event.attendees > attendeesList.length && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted border-2 border-background text-sm font-semibold text-foreground">
                          +{event.attendees - attendeesList.length}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </div>
                      <p className="text-muted-foreground">per person</p>
                    </div>

                    <Link to={`/events/${event.id}/checkout?tickets=1`}>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow mb-4"
                      >
                        {event.price === 0 ? "Join Event (Free)" : `Join Event - $${event.price}`}
                      </Button>
                    </Link>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Spots left</span>
                        <span className="font-semibold text-foreground">
                          {event.maxAttendees - event.attendees}
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

      <Footer />
    </div>
  );
};

export default EventDetails;