
import { FC } from "react";

interface RequestItem {
  id: number;
  number: string;
  description: string;
  address: string;
  employee: string;
  note: string;
  authorID: number;
}

interface RequestItemProps {
  items: RequestItem[];
}

// const frameworks = [
//   {
//     id: 0,
//     value: "Фамилия 1",
//     label: "Фамилия 1",
//   },
//   {
//     id: 1,
//     value: "Фамилия 2",
//     label: "Фамилия 2",
//   },
//   {
//     id: 2,
//     value: "Фамилия 3",
//     label: "Фамилия 3",
//   },
//   {
//     id: 3,
//     value: "Фамилия 4",
//     label: "Фамилия 4",
//   },
//   {
//     id: 4,
//     value: "Фамилия 5",
//     label: "Фамилия 5",
//   },
// ];

export const RequestList: FC<RequestItemProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-3 p-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center font-bold ">
          <div className="w-24">Number</div>
          <div className="w-96">Description</div>
          <div className="w-48">Address</div>
          <div className="w-32">Employee</div>
          <div className="w-64">Note</div>
          <div className="w-32">AuthorID</div>
          <div className="w-32"></div>
        </div>
      </div>

      {items.map((item) => (
        <div className="flex" key={item.id}>
          <div className="flex flex-col gap-2 border justify-center p-2">
            <div className="flex justify-center items-center">
              <div className="w-24">{item.number}</div>
              <div className="w-96">{item.description}</div>
              <div className="w-48">{item.address}</div>
              {/* <ComboboxDemo items={frameworks} /> */}
              <div className="w-64">{item.note}</div>
              <div className="w-32">{item.authorID}</div>
            </div>
          </div>
          <div key={`buttons-${item.id}`}>
            {/* <Button variant="outline">Назначить</Button> */}
            {/* <Button variant="outline">Изменить</Button> */}
            {/* <Button variant="destructive">Отменить</Button> */}
          </div>
        </div>
      ))}
    </div>
  );
};
