import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Star } from "lucide-react";
import { EventFilters, FilterState } from "@/components/EventFilters";
import { mockEvents } from "@/data/mockData";

const Events = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    location: "",
    dateRange: "",
    priceRange: [0, 200],
  });

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(searchLower) ||
          event.host.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category !== "all") {
        if (event.category !== filters.category) return false;
      }

      // Price filter
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
        if (
          event.price < filters.priceRange[0] ||
          event.price > filters.priceRange[1]
        ) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find your next adventure and connect with amazing people
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <EventFilters
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filteredEvents.length}
            />
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/events/${event.id}`}>
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

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            {event.attendees}/{event.maxAttendees} attending
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span className="font-semibold text-foreground">
                              {event.rating}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {event.price === 0 ? "Free" : `$${event.price}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;
