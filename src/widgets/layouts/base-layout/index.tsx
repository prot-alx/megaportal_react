import { useAppSelector } from "@/app/store/store";
import { Footer } from "@/features/footer";
import { Header } from "@/features/header";
import { AuthForm } from "@/pages/login";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const BaseLayout: FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuth);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

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
