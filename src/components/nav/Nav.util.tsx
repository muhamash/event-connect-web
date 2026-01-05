import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants/nav.constant";
import { UserRole } from "@/types/utils.type";
import { signOut } from "next-auth/react";
import Link from "next/link";


type Props = {
  role: UserRole;
  isMobile?: boolean;
  closeMenu?: () => void;
};

export const NavRenderer = ( { role, isMobile, closeMenu }: Props ) =>
{
  return (
    <>
      {NAV_ITEMS.filter( item => item.roles.includes( role ) ).map( item =>
      {
        const Icon = item.icon;

        const base =
          isMobile
            ? "w-full justify-start"
            : "flex items-center gap-1";

        //  (Logout)
        if ( item.action === "logout" )
        {
          return (
            <Button
              key={item.label}
              variant={item.variant ?? "outline"}
              onClick={() =>
              {
                closeMenu?.();
                signOut({ callbackUrl: "/login" });
              }}
              className={`${ base } border-primary text-primary hover:bg-primary hover:text-primary-foreground`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Button>
          );
        }

        //PRIMARY CTA
        if ( item.variant === "primary" )
        {
          return (
            <Link key={item.label} href={item.href!} onClick={closeMenu}>
              <Button className={`${ base } bg-gradient-primary hover:shadow-glow`}>
                {item.label}
              </Button>
            </Link>
          );
        }

        // BUTTON LINKS
        if ( item.variant )
        {
          return (
            <Link key={item.label} href={item.href!} onClick={closeMenu}>
              <Button
                variant={item.variant}
                className={`${ base } border-primary text-primary hover:bg-primary hover:text-primary-foreground`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Button>
            </Link>
          );
        }

        //  NORMAL LINKS
        return (
          <Link
            key={item.label}
            href={item.href!}
            onClick={closeMenu}
            className={`text-foreground hover:text-primary transition-colors ${ base }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
          </Link>
        );
      } )}
    </>
  );
};