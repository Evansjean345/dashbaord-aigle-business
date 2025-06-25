"use client";
import Link from "next/link";
import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";
import {SwitchableTable} from "../table/organisation-table/switchableTable"
import {AddOrganisation} from "./addOrganisation";
import {Home13Icon, Briefcase07Icon} from "hugeicons-react"

export const Organisation = () => {
    return (
        <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">

            <Breadcrumbs variant="light">
                <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                <BreadcrumbItem startContent={<Briefcase07Icon/>}>Compte business</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex justify-end flex-wrap gap-4 items-center">
                <div className="flex flex-row gap-3.5 flex-wrap ">
                    <AddOrganisation/>
                </div>
            </div>
            <h3 className="text-xl font-semibold">Maillage réseau</h3>
            <div className="max-w-[95rem] mx-auto w-full">
                <SwitchableTable/>
            </div>
        </div>
    );
};
