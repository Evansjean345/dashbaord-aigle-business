"use client";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { TableWrapper } from "@/components/table/transactions-table/table";
import { Home13Icon,AiPhone02Icon  } from "hugeicons-react"
import { MobileTransfert } from "./mobileTransfert";
import { AmountState } from "../amount-state/amount";


export const MobileMoney = () => {
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs variant="light">
        <BreadcrumbItem startContent={<Home13Icon />}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
        <BreadcrumbItem startContent={<AiPhone02Icon />}>Mobile money</BreadcrumbItem>
      </Breadcrumbs>
      <AmountState/>
      <div className="flex justify-end flex-wrap gap-4 items-center">
        
        <div className="flex flex-row gap-3.5 flex-wrap">
          <MobileTransfert />
        </div>
      </div>
      <h3 className="text-xl font-semibold">Transactions mobile money</h3>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>

  );
};
