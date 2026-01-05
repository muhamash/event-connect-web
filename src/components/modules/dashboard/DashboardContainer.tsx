"use client"

import { mockEvents, mockUsers } from "@/components/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import
  {
    Bookmark,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Edit,
    Eye,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Star,
    TrendingUp,
    Users,
    XCircle
  } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";


type UserRole = "user" | "host" | "admin";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const currentRole = "host" as UserRole; 
  const currentUser = mockUsers[0];
  
  const hostedEvents = mockEvents.filter((e) => e.hostId === currentUser.id);
  const upcomingHosted = hostedEvents.filter((e) => e.status === "open");
  const joinedEvents = mockEvents.slice(2, 5);
  const pastEvents = mockEvents.slice(0, 2);
  const savedEvents = mockEvents.slice(3, 6);

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

  // User Dashboard View
  const renderUserDashboard = () => (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="bg-muted mb-6">
        <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        <TabsTrigger value="past">Past Events</TabsTrigger>
        <TabsTrigger value="saved">Saved Events</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Joined Events
            </CardTitle>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                Browse Events
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {joinedEvents.length > 0 ? (
              <div className="space-y-4">
                {joinedEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="block">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-16 w-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground truncate">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.date} at {event.time}
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
                          <AvatarFallback>{event.host.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground hidden md:block">
                          by {event.host}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming events</p>
                <Link href="/events">
                  <Button className="mt-4 bg-gradient-primary">Find Events</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="past" className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              Past Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-16 w-24 object-cover rounded-lg opacity-75"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Leave review for event:", event.id);
                      toast.success("Review submitted!");
                    }}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Leave Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved" className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              Saved Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="bg-muted/50 border-border hover:border-primary/50 transition-all group overflow-hidden">
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary">{event.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-foreground truncate">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      <p className="text-sm font-bold text-primary mt-2">
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  // Host Dashboard View
  const renderHostDashboard = () => (
    <>
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
              <Badge variant="outline" className="border-green-500/50 text-green-500">
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

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-muted mb-6">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hosted Events</CardTitle>
              <Link href="/events/create">
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-16 w-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate">{event.title}</h4>
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
                            : event.status === "full"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {event.status}
                      </Badge>
                      <p className="text-sm font-bold text-primary mt-1">
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => console.log("View event:", event.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => console.log("Edit event:", event.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            console.log("Cancel event:", event.id);
                            toast.success("Event cancelled");
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Event Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search participants..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.slice(1, 4).map((user, idx) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{hostedEvents[idx % hostedEvents.length]?.title || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/20 text-green-500">Confirmed</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("View participant:", user.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-primary">$450</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Last Month</p>
                    <p className="text-2xl font-bold">$380</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-secondary">${stats.totalRevenue}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostedEvents.filter(e => e.price > 0).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>${event.price}</TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          ${event.price * event.attendees}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  const getDashboardTitle = () => {
    switch (currentRole) {
      case "admin":
        return "Admin Dashboard";
      case "host":
        return "Host Dashboard";
      default:
        return "My Events";
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                  {currentRole === "host"
                    ? "Manage your events and track performance"
                    : "Here's what's happening with your events"}
                </p>
              </div>
              {currentRole === "host" && (
                <Link href="/events/create">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Main Content based on role */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            {currentRole === "host" ? renderHostDashboard() : renderUserDashboard()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;