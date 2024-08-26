import { Footer } from "@/features/footer";
import { Header } from "@/features/header";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const BaseLayout: FC = () => {
  return (
    <div className="bg-slate-200">
      <div className="flex justify-center container bg-slate-300">
        <div className="flex flex-col items-center justify-center">
          <header className="fixed w-full top-0 flex justify-center items-center z-10 h-16 bg-slate-400">
            <Header />
          </header>
          <main className="pt-16 min-h-svh">
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
