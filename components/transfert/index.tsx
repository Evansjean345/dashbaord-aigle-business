"use client";
import {BreadcrumbItem, Breadcrumbs, Button} from "@heroui/react";
import Link from "next/link";
import React, {useState} from "react";
import {TableWrapper} from "@/components/table/transactions-table/table";
import {ArrowDataTransferHorizontalIcon, Home13Icon} from "hugeicons-react"
import {TransfertForm} from "./transfert";
import {Wallet} from "@/components/wallet";
import {CommissionButton} from "@/components/commissions/commissionButton";
import {CommissionModalComponent} from "@/components/commissions/commissionModal";
import {useOrganisationStore} from "@/stores/organisationStore";


export const Transferts = () => {
    const [isModalOpenTransfert, setIsModalOpenTransfert] = useState(false);
    const [openCommissionModal, setOpenCommissionModal] = useState(false);

    const activeOrganisation = useOrganisationStore(state => state.organisation)

    return (
        <div className="py-4 px-4 lg:px-6 2xl:px-10 mx-auto w-full space-y-6">
            <div className="w-full flex flex-col lg:flex-row items-start gap-y-2 lg:gap-y-0 lg:items-center">
                <Breadcrumbs variant="light" className="flex-1 w-full">
                    <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                    <BreadcrumbItem startContent={<ArrowDataTransferHorizontalIcon/>}>Transferts</BreadcrumbItem>
                </Breadcrumbs>

                {activeOrganisation?.account_type === "pdv" && (
                    <CommissionButton handleClick={() => setOpenCommissionModal(prev => !prev)}/>
                )}
            </div>

            <Wallet/>
            <div className="flex flex-col lg:flex-row justify-between flex-wrap gap-4 items-start lg:items-center">
                <h3 className="text-xl hidden lg:inline font-semibold">Liste des Transferts</h3>
                <div className="flex flex-row gap-3.5 flex-wrap w-full lg:w-auto">
                    <Button onPress={() => setIsModalOpenTransfert(true)} color="primary"
                            className="w-full dark:text-white lg:w-auto">
                        <ArrowDataTransferHorizontalIcon className="w-6 h-6"/>
                        Faire un transfert vers un mobile money
                    </Button>
                </div>
            </div>

            <div className="w-full">
                <TableWrapper/>
            </div>

            {isModalOpenTransfert && (<TransfertForm
                    isOpen={isModalOpenTransfert}
                    handleClose={() => setIsModalOpenTransfert(false)}
                />
            )}

            {openCommissionModal && (<CommissionModalComponent
                    isOpen={openCommissionModal}
                    handleClose={() => setOpenCommissionModal(false)}/>
            )}
        </div>

    );
};
