"use client"

import OngoingTabSkeleton from "@/components/skeletons/OngoingTabSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Calendar,
    DollarSign,
    Eye,
    Star,
    TrendingUp,
    Users
  } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import OngoingTab from "./OngoingTab";

interface HostDashboardProps {
  hostedEvents: any[];
  stats: {
    totalRevenue: number;
    totalAttendees: number;
    activeEvents: number;
    avgRating: number;
  };
  mockUsers: any[];
  eventsPromise: Promise<any>;
}

const HostDashboardRendere = ({ hostedEvents, stats, mockUsers, eventsPromise }: HostDashboardProps) => {

  const [ activeTab, setActiveTab ] = useState( "events" );
  const router = useRouter();

  useEffect( () =>
  {
    const params = new URLSearchParams( window.location.search );
    params.set( "page", "1" );
    router.replace( `?${ params.toString() }` );
  }, [ activeTab, router ] );

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
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

      <Tabs value={activeTab}
        onValueChange={(value) => setActiveTab(value)} defaultValue="events" className="w-full">
        <TabsList className="bg-muted mb-6">
          <TabsTrigger value="events">On going</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <Suspense fallback={
          <OngoingTabSkeleton/>
        }>
          {activeTab === "events" && <OngoingTab eventsPromise={eventsPromise} />}
        </Suspense>

        <TabsContent value="participants" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Event Participants</CardTitle>
            </CardHeader>
            <CardContent>
              
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
};

export default HostDashboardRendere;