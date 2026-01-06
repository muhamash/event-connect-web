"use client";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants/nav.constant";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { NavbarSkeleton } from "../skeletons/NavSkelton";
import { Badge } from "../ui/badge";
import { NavRenderer } from "./Nav.util";

export const Navbar = () =>
{
  const session = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if ( session.status === "loading" )
  {
    return <NavbarSkeleton />;
  }

  const isLoggedIn = !!session.data?.user?.role;
  const role = ( session.data?.user?.role?.toLowerCase() as any ) ?? "guest";

  
  
    const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  
  const navItems = NAV_ITEMS.filter( ( item ) => item.roles.includes( role ) );
  
  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              EventConnect
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex gap-4 items-center">
            {isLoggedIn && <Badge>{role}</Badge>}
            <NavRenderer role={role} />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Button onClick={toggleDrawer} variant="ghost" className="p-2">
              {drawerOpen ? <X className="h-6 w-6 z-999" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Mobile Drawer */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0  right-0 min-h-screen w-64  z-50 p-6 py-20 flex flex-col gap-4 bg-background/90 backdrop-blur-md border-l-[5px] border-orange-500"
                >
                  {navItems.map( ( item ) =>
                    item.action === "logout" ? (
                      <Button
                        key={item.label}
                        variant={item.variant ?? "outline"}
                        onClick={() => signOut( { callbackUrl: "/login" } )}
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Button>
                    ) : (
                      <Link key={item.label} href={item.href!} onClick={toggleDrawer}>
                        <Button
                          variant={item.variant ?? "ghost"}
                          className="flex items-center gap-2 w-full justify-start"
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </Button>
                      </Link>
                    )
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
      </div>
      
    </nav>
  );
};