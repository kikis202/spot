import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

type NavItem = {
  name: string;
  href: string;
  childs?: NavItem[];
};

type navLinks = {
  default: NavItem[];
  USER: NavItem[];
  COURIER: NavItem[];
  BUISNESS: NavItem[];
  SUPPORT: NavItem[];
  ADMIN: NavItem[];
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

export const NavItems = async () => {
  const session = await getServerAuthSession();

  if (!session?.user)
    return navLinks.default.map((item) => (
      <Link key={item.name} href={item.href}>
        {item.name}
      </Link>
    ));

  return navLinks[session.user.role].map((item) => (
    <Link key={item.name} href={item.href}>
      {item.name}
    </Link>
  ));
};
