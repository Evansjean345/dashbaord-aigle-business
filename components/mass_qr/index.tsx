"use client";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { TableWrapper } from "@/components/table/transactions-table/table";
import { Home13Icon,CrowdfundingIcon  } from "hugeicons-react"
import { AmountState } from "../amount-state/amount";
import { QRGenerator } from "./qrGenerator";

export const MassQr = () => {
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs variant="light">
        <BreadcrumbItem startContent={<Home13Icon />}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
        <BreadcrumbItem startContent={<CrowdfundingIcon />}>Générateur de code</BreadcrumbItem>
      </Breadcrumbs>
      <QRGenerator />
    </div>

  );
};
