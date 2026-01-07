"use client"

import { mockEvents, mockUsers } from "@/components/data/mockData";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import HostDashboardRendere from "./host/HostDashboardRendere";

type UserRole = "user" | "host" | "admin";

interface DashboardProps {
  userId: string;
  role: string;
  fullname: string;
  eventsPromise: Promise<any>;
}

const Dashboard = ({ userId, role, fullname, eventsPromise }: DashboardProps) => {
  
  const currentRole = role?.toLowerCase(); 
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
                    {fullname?.split( " " )[ 0 ].toUpperCase()}
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
            {currentRole === "host" ? (
              <HostDashboardRendere
                hostedEvents={hostedEvents}
                eventsPromise={eventsPromise}
                stats={stats}
                mockUsers={mockUsers}
              />
            ) : (
              <HostDashboardRendere
                  hostedEvents={hostedEvents}
                  eventsPromise={eventsPromise}
                stats={stats}
                mockUsers={mockUsers}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;