import { useState } from "react";
import { AuthService } from "@/app/store/auth/auth.service";
import { useAppSelector } from "@/app/store/store";
import { Button } from "@/shared";
import { RequestCreation } from "@/features";
import { RiCloseFill, RiMenu2Fill } from "@remixicon/react";
import { MenuList } from "@/widgets";
import { topmenu } from "../model";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onLogoutClick = () => AuthService.logout();

  const userName = useAppSelector((state) => state.auth?.user_name);
  const userRole = useAppSelector((state) => state.auth?.user_role);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex justify-between gap-10 items-center">
      <div className="hidden xl:block">
        <span>
          {userName} - {userRole}
        </span>
      </div>
      <RequestCreation />

      {/* Бургер-меню для мобильных устройств */}
      <div className="xl:hidden">
        <button onClick={toggleMenu} className="p-2 focus:outline-none">
          {isMenuOpen ? (
            <RiCloseFill className="w-6 h-6" />
          ) : (
            <RiMenu2Fill className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Основное меню (скрыто на мобильных устройствах) */}
      <div className="hidden xl:flex flex-1">
        <MenuList items={topmenu.items} />
      </div>

      {/* Мобильное меню (отображается только если isMenuOpen) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start p-4 xl:hidden">
          <div className="bg-white rounded-lg w-64 p-4 shadow-lg">
            <MenuList items={topmenu.items} onItemClick={toggleMenu} />
          </div>
        </div>
      )}

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
