import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import { mockEvents, mockUsers } from "@/data/mockData";

const Dashboard = () => {
  const currentUser = mockUsers[0];
  const hostedEvents = mockEvents.filter((e) => e.hostId === currentUser.id);
  const upcomingHosted = hostedEvents.filter((e) => e.status === "open");
  const pastHosted = hostedEvents.slice(0, 2);
  const joinedEvents = mockEvents.slice(2, 5);

  const stats = {
    totalRevenue: 1250,
    totalAttendees: 68,
    activeEvents: upcomingHosted.length,
    avgRating: 4.8,
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back,{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {currentUser.name.split(" ")[0]}
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your events
                </p>
              </div>
              <Link to="/events/create">
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <Badge
                    variant="outline"
                    className="border-green-500/50 text-green-500"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
                <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <p className="text-2xl font-bold">{stats.activeEvents}</p>
                <p className="text-sm text-muted-foreground">Active Events</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                </div>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="hosting" className="w-full">
              <TabsList className="bg-muted mb-6">
                <TabsTrigger value="hosting">Hosting</TabsTrigger>
                <TabsTrigger value="attending">Attending</TabsTrigger>
              </TabsList>

              <TabsContent value="hosting" className="space-y-6">
                {/* Upcoming Events */}
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Link to="/events">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingHosted.map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          className="block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-16 w-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground truncate">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event.attendees}/{event.maxAttendees}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  event.status === "open"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {event.status}
                              </Badge>
                              <p className="text-sm font-bold text-primary mt-1">
                                {event.price === 0
                                  ? "Free"
                                  : `$${event.price}`}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Attendees */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Recent Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex -space-x-3">
                      {mockUsers.slice(0, 6).map((user, i) => (
                        <Avatar
                          key={user.id}
                          className="border-2 border-background"
                        >
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-bold border-2 border-background">
                        +42
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attending" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Events You're Attending</CardTitle>
                    <Link to="/events">
                      <Button variant="ghost" size="sm">
                        Browse Events
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {joinedEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          className="block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-16 w-24 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground truncate">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={event.hostAvatar} />
                                <AvatarFallback>
                                  {event.host.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
