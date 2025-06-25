"use client";
import {Button} from "@heroui/react";
import Link from "next/link";
import React, {useState} from "react";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";
import {TableWrapper} from "@/components/table/supply-table/table";
import {Home13Icon, Payment02Icon} from "hugeicons-react";
import {AmountState} from "../amount-state/amount";
import {Toaster} from "sonner";
import AddSupply from "./addSupply";

export const Supply = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <Toaster/>
            <Breadcrumbs variant="light">
                <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                <BreadcrumbItem startContent={<Payment02Icon/>}>Demandes d&apos;approvisionnnement</BreadcrumbItem>
            </Breadcrumbs>
            <AmountState/>
            <div className="flex justify-end flex-wrap gap-4 items-center ">
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Button color="primary" onPress={() => setIsOpen(true)}>Nouvelle demande</Button>
                </div>
            </div>
            <h3 className="text-xl font-semibold">Liste des demandes d&apos;approvisionnement</h3>
            <div className="max-w-[95rem] mx-auto w-full">
                <TableWrapper/>
            </div>

            {isOpen && <AddSupply isOpen={isOpen} onClose={() => setIsOpen(false)}/>}
        </div>
    );
};
