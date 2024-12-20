import { AuthService } from "@/app/store/auth/auth.service";
import { useAppSelector } from "@/app/store/store";
import { RequestCreation } from "@/features/requests";
import { MenuList } from "@/widgets";
import { RiCloseFill, RiMenu2Fill } from "@remixicon/react";
import { useState } from "react";
import { topmenu } from "../model";
import { MobileMenu } from "./mobile-menu";
import { Button } from "@/shared";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userName = useAppSelector((state) => state.auth?.user_name);
  const userRole = useAppSelector((state) => state.auth?.user_role);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const onLogoutClick = () => AuthService.logout();

  return (
    <div className="flex justify-between gap-10 items-center">
      <div className="hidden xl:block">
        <span>
          {userName} - {userRole}
        </span>
      </div>

      <RequestCreation />

      <div className="xl:hidden">
        <button onClick={toggleMenu} className="p-2 focus:outline-none">
          {isMenuOpen ? (
            <RiCloseFill className="w-6 h-6" />
          ) : (
            <RiMenu2Fill className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="hidden xl:flex flex-1">
        <MenuList items={topmenu.items} />
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        items={topmenu.items}
      />

      <Button
        variant={"ghost"}
        onClick={onLogoutClick}
        className="hover:bg-red-900 hover:text-gray-100"
      >
        Выход
      </Button>
    </div>
  );
};
