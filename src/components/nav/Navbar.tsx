"use client";

import { UserRole } from "@/generated/prisma/enums";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { NavbarSkeleton } from "../skeletons/NavSkelton";
import { Badge } from "../ui/badge";
import { NavRenderer } from "./Nav.util.tsx";

export const Navbar = () => {
  const [ isOpen, setIsOpen ] = useState( false );
  const session = useSession();

  if ( session?.status === "loading" )
  {
    return <NavbarSkeleton/>
  }

  console.log(session?.data)
  const isLoggedIn = session?.data ? true : false;

  const role: UserRole = session?.data?.user?.role?.toLowerCase() || "guest";

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:shadow-glow">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              EventConnect
            </span>
          </Link>

          <div className="hidden md:flex gap-6 justify-center items-center">
            {
              isLoggedIn && <Badge>{ role }</Badge>
            }
            <NavRenderer role={role} />
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 space-y-2"
            >
              <NavRenderer
                role={role}
                isMobile
                closeMenu={() => setIsOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};