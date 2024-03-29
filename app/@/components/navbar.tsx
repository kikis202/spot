"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeSelect } from "./theme-select";
import { usePathname } from "next/navigation";

import type { Role } from "@prisma/client";

type NavItem = {
  name: string;
  href: string;
  description?: string;
  childs?: NavItem[];
};

type navLinks = {
  [key in Role | "default"]: NavItem[];
};

const navLinks: navLinks = {
  default: [
    {
      name: "Sending parcels",
      href: "/",
    },
    {
      name: "Find parcel",
      href: "/parcel/view",
    },
    {
      name: "Sign in",
      href: "/api/auth/signin",
    },
  ],
  USER: [
    {
      name: "Overview",
      href: "/",
    },
    {
      name: "Send parcel",
      href: "/parcel/send",
    },
    {
      name: "My parcels",
      href: "/parcel/own",
    },
    {
      name: "Tracked parcels",
      href: "/parcel/track",
    },
    {
      name: "Find parcel",
      href: "/parcel/view",
    },
    {
      name: "Sign out",
      href: "/api/auth/signout",
    },
  ],
  COURIER: [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Pick up parcels",
      href: "/parcel/pickup",
    },
    {
      name: "Update parcel status",
      href: "/parcel/update",
    },
    {
      name: "Sign out",
      href: "/api/auth/signout",
    },
  ],
  BUISNESS: [],
  SUPPORT: [],
  ADMIN: [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Users",
      href: "/users/list",
    },
    {
      name: "Parcels",
      href: "/parcel/list",
    },
    {
      name: "Parcel machines",
      href: "/parcelMachines/list",
    },
    {
      name: "Sign out",
      href: "/api/auth/signout",
    }
  ],
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  const pathname = usePathname();

  return (
    <li>
      <Link href={href ?? ""} legacyBehavior passHref>
        <NavigationMenuLink active={href === pathname} asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

const NavLinks = ({ navLinks }: { navLinks: NavItem[] }) => {
  const pathname = usePathname();

  return navLinks.map((item) => (
    <NavigationMenuItem key={item.name}>
      {item.childs ? (
        <>
          <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {item.childs.map((child) => (
                <ListItem key={child.name} title={child.name} href={child.href}>
                  {child.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </>
      ) : (
        <Link href={item.href} legacyBehavior passHref>
          <NavigationMenuLink
            active={item.href === pathname}
            className={navigationMenuTriggerStyle()}
          >
            {item.name}
          </NavigationMenuLink>
        </Link>
      )}
    </NavigationMenuItem>
  ));
};

export const Navbar = ({ role }: { role: Role | "default" }) => {
  return (
    <div className="flex h-16 items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavLinks navLinks={navLinks[role]} />
        </NavigationMenuList>
      </NavigationMenu>

      <ThemeSelect />
    </div>
  );
};
