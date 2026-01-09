import
  {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Plus,
    Shield,
    User
  } from "lucide-react";
import { NavItem } from "../../types/utils.type";


export const NAV_ITEMS: NavItem[] = [
  {
    label: "Explore Events",
    href: "/events",
    roles: ["guest", "user", "host"],
  },
  {
    label: "Become a Host",
    href: "/register?tab=host",
    roles: ["guest"],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["host"],
  },
  {
    label: "My Events",
    href: "/my-events",
    icon: CalendarDays,
    roles: ["user", "host"],
  },
  {
    label: "Create Event",
    href: "/events/create",
    icon: Plus,
    roles: ["host"],
  },
  {
    label: "Admin Dashboard",
    href: "/admin",
    icon: Shield,
    roles: ["admin"],
  },
  {
    label: "View all Events",
    href: "/events",
    icon: CalendarDays,
    roles: ["admin"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    roles: ["user", "host", "admin"],
    variant: "ghost",
  },
  {
    label: "Login",
    href: "/login",
    roles: ["guest"],
    variant: "ghost",
  },
  {
    label: "Get Started",
    href: "/register",
    roles: ["guest"],
    variant: "primary",
  },
  {
    label: "Logout",
    roles: ["user", "host", "admin"],
    icon: LogOut,
    variant: "outline",
    action: "logout",
  },
];
