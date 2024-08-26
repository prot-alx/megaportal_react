import { Button } from "@/shared/components/ui/button";
import { MenuList } from "../../entities/top-menu";
import { topmenu } from "./model";
import { AuthService } from "@/app/store/auth/auth.service";
import { useAppSelector } from "@/app/store/store";

const Header: React.FC = () => {
  const onLogoutClick = () => AuthService.logout();

  // Получаем данные пользователя из Redux store
  const userName = useAppSelector((state) => state.auth?.user_name);
  const userRole = useAppSelector((state) => state.auth?.user_role);
  
  return (
    <div className="flex justify-between gap-10 items-center">
      <div>
        <span>{userName}</span> - <span>{userRole}</span>
      </div>
      <MenuList items={topmenu.items} />
      <Button variant={"ghost"} onClick={onLogoutClick}>
        Выход
      </Button>
    </div>
  );
};

export { Header };
