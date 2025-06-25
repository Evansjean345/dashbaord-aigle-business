import { User, Tooltip, Chip } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { PencilEdit02Icon, Delete03Icon, MoreVerticalCircle02Icon } from "hugeicons-react"
import { DetailsItems } from "./details-items";
import { Actions } from "./actions";
import { Supply } from "@/types/supply.types";
import Image from "next/image";

interface Props {
  supply: Supply;
  columnKey: string | React.Key;
}

export const RenderCell = ({ supply, columnKey }: Props) => {

  if (columnKey.toString().includes('paymentProvider.')) {
    const nestedKey = columnKey.toString().split('.')[1];
    const cellValue = supply.paymentProvider?.[nestedKey as keyof typeof supply.paymentProvider];
    return cellValue;
  }

  // @ts-ignore
  const cellValue = supply[columnKey];
  switch (columnKey) {

    case "documentUrl":
      return (
        <div className="flex flex-col">
          <Image src={cellValue} alt="image" width={50} height={50} />
        </div>
      );
    case "amount":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue} FCFA
          </p>
        </div>
      );
    case "provisionType":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue === "airtime" ? "Cabine intelligente" : "Compte principale"}
          </p>
        </div>
      );
    case "status":
      return (
        <Chip
          size="md"
          variant="shadow"
          color={
            cellValue === "success"
              ? "success"
              : cellValue === "pending"
                ? "warning"
                : cellValue === "failed"
                  ? "danger"
                  : "default"
          }
        >
          <span className="capitalize text-sm">{
            cellValue === "success"
              ? "Succès"
              : cellValue === "pending"
                ? "En attente"
                : cellValue === "failed"
                  ? "Échec"
                  : ""
          }
          </span>
        </Chip>
      );
    case "paymentProvider.type":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue === "mobile_money" ? "Mobile money" : "Banque"}
          </p>
        </div>
      );
    case "createdAt":
      return (
        <div className="flex flex-col text-base font-semibold">
          <p className="text-bold text-small capitalize">
            {new Date(cellValue as string).toLocaleDateString()}
          </p>
          <p className="text-bold text-small capitalize">
            {new Date(cellValue as string).toLocaleTimeString()}
          </p>
        </div>
      );
    case "actions":
      return (
        <>
          <div className="flex items-center gap-4 ">
            <div>
              <Actions supply={supply} />
            </div>
          </div>
        </>
      );
    default:
      return cellValue;
  }
};
