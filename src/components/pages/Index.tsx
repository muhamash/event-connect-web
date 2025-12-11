"use client"

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import
  {
    ArrowRight,
    Calendar,
    Coffee,
    Dumbbell,
    Heart,
    MapPin,
    Music,
    Palette,
    Shield,
    Star,
    Users,
    Zap
  } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const stats = [
    { label: "Active Members", value: "50K+", icon: Users },
    { label: "Events Hosted", value: "10K+", icon: Calendar },
    { label: "Cities Covered", value: "200+", icon: MapPin },
    { label: "Success Rate", value: "98%", icon: Star },
  ];

  const categories = [
    { name: "Music & Concerts", icon: Music, color: "text-primary" },
    { name: "Sports & Fitness", icon: Dumbbell, color: "text-secondary" },
    { name: "Food & Dining", icon: Coffee, color: "text-accent" },
    { name: "Arts & Culture", icon: Palette, color: "text-primary" },
  ];

  const features = [
    {
      icon: Users,
      title: "Find Your Tribe",
      description: "Connect with like-minded people who share your passions and interests.",
    },
    {
      icon: Shield,
      title: "Safe & Verified",
      description: "All users are verified with ratings and reviews for your peace of mind.",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Smart algorithms match you with the perfect event companions in seconds.",
    },
    {
      icon: Heart,
      title: "Build Connections",
      description: "Form lasting friendships through shared experiences and adventures.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Attendee",
      content: "Found amazing friends through concerts I'd have missed. Life-changing experience!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Event Host",
      content: "Hosting hiking trips has never been easier. The platform handles everything seamlessly.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Active Member",
      content: "No more sitting at home! I've attended 15 events in 3 months. Absolutely love it!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={"/assets/hero-events.jpg"}
            alt="People enjoying events together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 z-10 text-center"
        >
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
            🎉 Join 50,000+ Active Members
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Never Attend an
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Event Alone Again
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Connect with people who share your interests. From concerts to hiking trips, find your
            perfect event companions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:shadow-glow text-lg px-8 py-6"
              >
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/host">
              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-lg px-8 py-6"
              >
                Host an Event
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-gradient-primary bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Join, discover, and connect in three easy steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us about your interests and what events excite you.",
              },
              {
                step: "02",
                title: "Find Events",
                description: "Browse curated events matching your preferences and location.",
              },
              {
                step: "03",
                title: "Connect & Attend",
                description: "Match with companions and experience events together.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                {...fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-card border-border hover:border-primary/50 transition-all h-full hover:shadow-card">
                  <CardContent className="p-8">
                    <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="bg-gradient-gold bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              From music to sports, find events that match your passion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-card">
                  <CardContent className="p-8 text-center">
                    <category.icon className={`h-12 w-12 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">EventConnect</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border h-full hover:shadow-card transition-all">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-gold bg-clip-text text-transparent">Community Says</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <motion.div {...fadeInUp} className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of people making real connections through shared experiences
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground hover:shadow-glow text-lg px-12 py-6"
            >
              Join EventConnect Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
