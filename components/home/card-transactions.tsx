import { Avatar, Card, CardBody } from "@heroui/react";
import React from "react";

const items = [
  {
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    name: "Maria clay",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    name: "Roy sanders",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    name: "Guillard ruiz",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    name: "Conrad andres",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
];

export const CardTransactions = () => {
  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Dernières transactions
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          <div className="grid grid-cols-5 w-full">
            <div>
              <span className="text-default-900  font-semibold">
                Organisation
              </span>
            </div>
            <div>
              <span className="text-default-900  font-semibold">
                Agent
              </span>
            </div>
            <div>
              <span className="text-default-900  font-semibold">
                Type
              </span>
            </div>
            <div>
              <span className="text-success text-xs">
                Montant
              </span>
            </div>
            <div>
              <span className="text-default-500 text-xs">
                Date
              </span>
            </div>
          </div>
          {items.map((item) => (
            <div key={item.name} className="grid grid-cols-5 w-full">

              <div>
                <span className="text-default-900  font-semibold">
                  {item.name}
                </span>
              </div>
              <div>
                <span className="text-default-900  font-semibold">
                  {item.name}
                </span>
              </div>
              <div>
                <span className="text-default-900  font-semibold">
                  {item.amount}
                </span>
              </div>
              <div>
                <span className="text-success text-xs">
                  {item.amount}
                </span>
              </div>
              <div>
                <span className="text-default-500 text-xs">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
