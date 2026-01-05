"use client"

import { Skeleton } from "../ui/skeleton";


export const NavbarSkeleton = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </nav>
  );
};