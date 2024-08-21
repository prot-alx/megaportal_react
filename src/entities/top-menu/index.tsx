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
                isActive
                  ? "flex h-12 items-center w-full justify-center bg-slate-300"
                  : "flex h-12 items-center"
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
