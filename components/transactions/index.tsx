"use client";

import Link from "next/link";
import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";
import {TableWrapper} from "@/components/table/transactions-table/table";
import {Home13Icon, TransactionIcon} from "hugeicons-react"

export const Transactions = () => {
    return (
        <div className="py-8 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <Breadcrumbs variant="light">
                <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                <BreadcrumbItem startContent={<TransactionIcon/>}>Transactions</BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-2xl font-semibold mb-8 mt-4">Liste de toutes les transactions</h3>
            <div className="max-w-[95rem] mx-auto w-full">
                <TableWrapper/>
            </div>
        </div>
    );
};
