import { MenuList } from "../../entities/top-menu";
import { topmenu } from "./model";

const Header: React.FC = () => {
  return (
    <div className="">
      <MenuList items={topmenu.items} />
    </div>
  );
};

export { Header };
