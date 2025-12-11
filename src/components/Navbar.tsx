"use client"

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = true; 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-orange-500 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow transition-all">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-black bg-clip-text text-transparent">
              EventConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-foreground hover:text-primary transition-colors">
              Explore Events
            </Link>
            
            {!isLoggedIn ? (
              <>
                <Link href="/host" className="text-foreground hover:text-primary transition-colors">
                  Become a Host
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-muted">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/events/create" className="text-foreground hover:text-primary transition-colors">
                  Create Event
                </Link>
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
                <Link href="/profile/user-1">
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-muted">
                    Profile
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Logout
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3">
                <Link
                  href="/events"
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Explore Events
                </Link>
                
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/host"
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Become a Host
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-muted">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all">
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/my-events"
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Events
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary hover:bg-muted">
                        Profile
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
