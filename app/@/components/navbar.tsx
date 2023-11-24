import { cn } from "@/lib/utils";
import { NavItems } from "./navbar-items";
import { ThemeSelect } from "./theme-select";

export const Navbar = () => {
  return (
    <div className="flex h-16 items-center px-4">
      <nav className={cn("mx-6 flex items-center space-x-4 lg:space-x-6")}>
        <NavItems />
        <ThemeSelect />
      </nav>
    </div>
  );
};
