"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/lib/interface/event.interface";
import { formatDate } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";


interface EventCardProps {
  event: Event;
  href?: string;
  index?: number;
  fadeInUp?: MotionProps["initial"];
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  href = `/events/${event.id}`,
  index = 0,
  fadeInUp = { opacity: 0, y: 20 },
} ) =>
{
  console.log( event )
  
  return (
    <motion.div
      key={event.id}
      initial={fadeInUp}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href}>
        <Card className="bg-card border-border hover:border-primary/50 transition-all group overflow-hidden h-full hover:shadow-card">
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground">
                {event.category}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {formatDate(event.date, {withTime: false})} at {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                {event?.participants?.length}/{event?.maxParticipants} attended
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="font-semibold text-foreground">{event?.rating}</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {event?.joiningFee === 0 ? "Free" : `$${event.joiningFee}`}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EventCard;