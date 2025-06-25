"use client";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { TableWrapper } from "@/components/table/transactions-table/table";
import { Home13Icon,CrowdfundingIcon  } from "hugeicons-react"
import { AmountState } from "../amount-state/amount";
import {BulkTransfer} from "./addMassPayment";

export const MassPAyment = () => {
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs variant="light">
        <BreadcrumbItem startContent={<Home13Icon />}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
        <BreadcrumbItem startContent={<CrowdfundingIcon />}>Transfert en masse</BreadcrumbItem>
      </Breadcrumbs>
      <AmountState/>
      <div className="flex justify-end flex-wrap gap-4 items-center">
        
        <div className="flex flex-row gap-3.5 flex-wrap">
          <BulkTransfer />
        </div>
      </div>
      <h3 className="text-xl font-semibold">Transfert en masse</h3>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>

  );
};
