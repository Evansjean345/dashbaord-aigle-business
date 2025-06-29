import { Avatar, AvatarGroup, Card, CardBody } from "@heroui/react";
import React from "react";
import { Wallet03Icon } from 'hugeicons-react'
const pictureUsers = [
  "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "https://i.pravatar.cc/150?u=a04258114e29026702d",
  "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
];

export const CardAgents = () => {
  return (
    <Card className=" bg-default-50 rounded-xl shadow-md w-full">
      <CardBody className="gap-6 flex flex-col">
        <p className="text-xl flex font-semibold text-center text-primary p-2 bg-blue-200 rounded-md mx-auto">
          <Wallet03Icon />
          Porte feuille
        </p>
        <div className="flex items-center gap-6 flex-col">
          <span className="text-xs">
            Meet your agenda and see their ranks to get the best results
          </span>
          <AvatarGroup isBordered>
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
          </AvatarGroup>
        </div>
      </CardBody>
    </Card>
  );
};
