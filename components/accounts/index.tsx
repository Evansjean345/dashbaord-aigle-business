"use client";

import Link from "next/link";
import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";
import {TableWrapper} from "@/components/table/user-table/table";
import {AddUser} from "./add-user";
import {Home13Icon, UserGroupIcon} from "hugeicons-react"

export const Accounts = () => {
    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <Breadcrumbs variant="light">
                <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                <BreadcrumbItem startContent={<UserGroupIcon/>}>Utilisateurs</BreadcrumbItem>
            </Breadcrumbs>
            <h3 className="text-xl font-semibold">Utilisateurs</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap"></div>
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <AddUser/>
                </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <TableWrapper/>
            </div>
        </div>

    );
};
