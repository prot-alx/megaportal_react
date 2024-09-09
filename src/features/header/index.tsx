import { Button } from "@/shared/components/ui/button";
import { MenuList } from "../../entities/top-menu";
import { topmenu } from "./model";
import { AuthService } from "@/app/store/auth/auth.service";
import { useAppSelector } from "@/app/store/store";
import { RequestCreation } from "@/features/RequestCreation";

const Header: React.FC = () => {
  const onLogoutClick = () => AuthService.logout();

  const userName = useAppSelector((state) => state.auth?.user_name);
  
  return (
    <div className="flex justify-between gap-10 items-center">
      <div>
        <span>{userName}</span>
      </div>
      <RequestCreation />
      <MenuList items={topmenu.items} />
      <Button variant={"ghost"} onClick={onLogoutClick} className="hover:bg-red-900 hover:text-gray-100">
        Выход
      </Button>
    </div>
  );
};

export { Header };
