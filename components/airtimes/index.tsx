"use client";

import {BreadcrumbItem, Breadcrumbs, Button} from "@heroui/react";
import Link from "next/link";
import React, {useState} from "react";
import {TableWrapper} from "@/components/table/airtime-table/table";
import {AiPhone02Icon, Home13Icon} from "hugeicons-react"
import {AmountState} from "../amount-state/amount";
import {AddAirtimes} from "./addAirtimes";

export const Airtimes = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="py-4 lg:px-6 2xl:px-10 mx-auto w-full space-y-4">
            <Breadcrumbs variant="light">
                <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                <BreadcrumbItem startContent={<AiPhone02Icon/>}>Airtimes</BreadcrumbItem>
            </Breadcrumbs>
            <AmountState/>
            <div className="flex justify-end mx-auto w-full flex-wrap items-center">
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" variant="solid" className="text-white" onPress={() => setIsOpen(true)}>Acheter du crédit</Button>
                </div>
            </div>
            <h3 className="text-xl font-semibold">Airtimes</h3>
            <div className="w-full">
                <TableWrapper/>
            </div>
            {isOpen && <AddAirtimes isAirtimeOpen={isOpen} onAirtimeClose={() => setIsOpen(false)}/>}
        </div>
    );
};
