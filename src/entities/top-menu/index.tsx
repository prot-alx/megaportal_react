import { cn } from "@/shared/utils";
import { FC } from "react";
import { NavLink } from "react-router-dom";

interface MenuListItem {
  id: number;
  text: string;
  link: string;
}

interface MenuListProps {
  items: MenuListItem[];
}

export const MenuList: FC<MenuListProps> = ({ items }) => {
  return (
    <div className="flex justify-center">
      <ul className="flex gap-2">
        {items.map((item) => (
          <li className="flex justify-center min-w-36" key={item.id}>
            <NavLink
              to={item.link}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-slate-300 text-black"
                    : "bg-transparent text-black hover:bg-gray-200"
                )
              }
            >
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
