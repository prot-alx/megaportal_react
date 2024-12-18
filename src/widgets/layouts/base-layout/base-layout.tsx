import { Header, Footer } from "@/features";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const BaseLayout: FC = () => {
  return (
    <div className="bg-slate-200">
      <div className="flex justify-center px-10 bg-slate-300">
        <div className="flex flex-col items-center justify-center">
          <header className="fixed w-full top-0 flex justify-center items-center z-10 h-16 bg-slate-400 bg-opacity-80">
            <Header />
          </header>
          <main className="pt-20 min-h-svh">
            <Outlet />
          </main>
          <footer className="w-full mt-auto">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export { BaseLayout };
