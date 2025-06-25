"use client";

import Link from "next/link";
import React, {useState} from "react";
import {BreadcrumbItem, Breadcrumbs, Button} from "@heroui/react";
import {TableWrapper} from "@/components/table/transactions-table/table";
import {ArrowDataTransferHorizontalIcon, Home13Icon, Payment02Icon} from "hugeicons-react"
import {LinkPayment} from "./addLinkPayment";
import {QrModal} from "./generateQr";
import {useOrganisationStore} from "@/stores/organisationStore";
import {CopyPaymentLink} from "@/components/payments/copyPaymentLink";
import {Wallet} from "@/components/wallet";
import {CommissionModalComponent} from "@/components/commissions/commissionModal";
import {CommissionButton} from "@/components/commissions/commissionButton";

export const Payments = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);
    const qrId = activeOrganisation?.qr_code?.url;

    const [openCommissionModal, setOpenCommissionModal] = useState(false);

    return (
        <div className="py-4 px-4 lg:px-6 2xl:px-10 mx-auto w-full space-y-6">
            <div className="w-full flex flex-col lg:flex-row items-start gap-y-2 lg:gap-y-0 lg:items-center">
                <Breadcrumbs variant="light" className="flex-1">
                    <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                    <BreadcrumbItem startContent={<Payment02Icon/>}>Paiements</BreadcrumbItem>
                </Breadcrumbs>

                {activeOrganisation?.account_type === "pdv" && (
                    <CommissionButton handleClick={() => setOpenCommissionModal(prev => !prev)}/>
                )}
            </div>

            <Wallet/>
            <div className="w-full flex flex-col lg:flex-row items-start gap-y-4 lg:items-center py-1">
                <div className="flex-1">
                    <h3 className="text-2xl font-semibold">Liste des paiements</h3>
                </div>
                <div className="flex items-center self-end lg:self-start gap-x-2">
                    <CopyPaymentLink qrId={qrId}/>
                    <QrModal qrId={qrId}/>
                    <LinkPayment qrId={qrId}/>
                </div>
            </div>

            <div className="w-full">
                <TableWrapper/>
            </div>

            <CommissionModalComponent isOpen={openCommissionModal} handleClose={() => setOpenCommissionModal(false)}/>
        </div>
    );
};
