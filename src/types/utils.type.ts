import { LucideIcon } from "lucide-react";

export type UserRole = "guest" | "user" | "host" | "admin" | undefined | string;

export interface IInputErrorState
{
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}


export type NavItem = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  roles: UserRole[];
  variant?: "link" | "ghost" | "outline" | "primary";
  action?: "logout";
};