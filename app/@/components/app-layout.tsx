import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </div>
    </main>
  );
};
