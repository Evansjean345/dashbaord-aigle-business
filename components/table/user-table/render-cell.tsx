import { User, Tooltip, Chip } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { users } from "./data";
import { PencilEdit02Icon, Delete03Icon, MoreVerticalCircle02Icon } from "hugeicons-react"
import { DetailsItems } from "./details-items";
import { Actions } from "./actions";

interface Props {
  user: (typeof users)[number];
  columnKey: string | React.Key;
}

export const RenderCell = ({ user, columnKey }: Props) => {

  // @ts-ignore
  const cellValue = user[columnKey];
  switch (columnKey) {
    case "name":
      return (
        <User
          avatarProps={{
            src: user.avatar,
          }}
          name={cellValue}
        >
          {user.email}
        </User>
      );
    case "role":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{user.team}</span>
          </div>
        </div>
      );
    case "status":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "active"
              ? "success"
              : cellValue === "paused"
                ? "danger"
                : "warning"
          }
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );

    case "actions":
      return (
        <>
          <div className="flex items-center gap-4 ">
            <div>
              <Actions />
            </div>
          </div>


        </>
      );
    default:
      return cellValue;
  }
};
