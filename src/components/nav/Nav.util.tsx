"use client";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants/nav.constant";
import { UserRole } from "@/types/utils.type";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  role: UserRole;
};

export const NavRenderer = ({ role }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <>


      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        {navItems.map((item) =>
          item.action === "logout" ? (
            <Button
              key={item.label}
              variant={item.variant ?? "outline"}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Button>
          ) : (
            <Link key={item.label} href={item.href!}>
              <Button variant={item.variant ?? "ghost"} className="flex items-center gap-1">
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Button>
            </Link>
          )
        )}
      </div>

    </>
  );
};
