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
      childs: [
        {
          name: "Private customers",
          href: "/",
        },
        {
          name: "Business customers",
          href: "/",
        },
        {
          name: "Shipping abroad",
          href: "/",
        },
      ],
    },
    {
      name: "Tracking",
      href: "/",
    },
    {
      name: "Sign in",
      href: "/api/auth/signin",
    },
    {
      name: "Sign up",
      href: "/",
    },
  ],
  USER: [
    {
      name: "Overview",
      href: "/",
    },
    {
      name: "Orders",
      href: "/",
    },
    {
      name: "Sign out",
      href: "/api/auth/signout",
    },
  ],
  COURIER: [],
  BUISNESS: [],
  SUPPORT: [],
  ADMIN: [],
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
    </li>
  );
});
ListItem.displayName = "ListItem";

const navLinkMap = (item: NavItem) => (
  <NavigationMenuItem>
    {item.childs ? (
      <React.Fragment key={item.name}>
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
      </React.Fragment>
    ) : (
      <Link href={item.href} key={item.name} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {item.name}
        </NavigationMenuLink>
      </Link>
    )}
  </NavigationMenuItem>
);

export const Navbar = ({ role }: { role: Role | "default" }) => {
  return (
    <div className="flex h-16 items-center justify-between px-4">
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks[role].map(navLinkMap)}
        </NavigationMenuList>
      </NavigationMenu>

      <ThemeSelect />
    </div>
  );
};
