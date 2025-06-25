"use client";

import {BreadcrumbItem, Breadcrumbs, Button} from "@heroui/react";
import React, {useState} from "react";
import {QrModal} from "./generateQr";
import {toast} from "sonner";
import {ButtonSpinner} from "@/components/ui/button-spinner";
import {useOrganisationStore} from "@/stores/organisationStore";
import {AiPhone02Icon, Home13Icon} from "hugeicons-react";
import Link from "next/link";
import StatisticWidgetContainer from "@/components/kbine/StatisticWidgetContainer";
import {CopyPaymentLink} from "@/components/payments/copyPaymentLink";
import {AirtimeQrCodeCreated} from "@/types/organisation.types";
import {useAlertStore} from "@/stores/useAlert";
import {useCreateSmartkbine} from "@/hooks/useSmartkbine";
import {SmartKineTransactions} from "@/components/kbine/SmartKbineTransactions";
import {CashoutFounds} from "@/components/kbine/cashoutFounds";
import {CashoutType} from "@/types/transaction.types";
import {DownloadIcon} from "lucide-react";

const cashoutTypeList: CashoutType[] = [
    {label: "Fonds Collecte", value: "airtime_revenue"},
    {label: "Commissions Smart-kbine", value: "airtime_commission"},
]


/**
 * Kbine is a React functional component that manages the state and actions related to a "smart cabine"
 * or virtual cabin for organisations. It provides functionalities for creating a smart cabin, handling
 * payment-related QR codes, copying payment links to the clipboard, and withdrawing funds.
 *
 * The component integrates multiple functionalities, such as:
 * - Managing the state of the active organisation using custom stores.
 * - Handling asynchronous operations for creating a new smart cabin.
 * - Allowing users to copy payment QR code links to the clipboard.
 * - Displaying a user interface with breadcrumbs, widgets, and modals for interacting with the smart cabin.
 *
 * The UI adapts based on the presence or absence of an existing smart cabin for the active organisation.
 */
export const Kbine = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);
    const updateActiveOrganisationAirtimeQrCode = useOrganisationStore(state => state.updateOrganisationAirtime)
    const qrId = activeOrganisation?.airtime_qrcode?.url;
    const closeAlert = useAlertStore(state => state.closeAlert)

    const {isCreateSmartkbinePending, createSmartkbine} = useCreateSmartkbine()

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const stockToClipboard = async () => {
        await navigator.clipboard.writeText(qrId);
        toast.success("Lien de paiement copié dans le presse-papier");
    };

    /**
     * Handles the creation of a smart kbine.
     * This function is asynchronous and uses a callback function to handle success events.
     */
    const handleCreateKbine = async () => {
        createSmartkbine(undefined, {
            onSuccess: async (data: AirtimeQrCodeCreated) => {
                const airtimeQrCode = {
                    code: data.code,
                    status: data.status,
                    url: data.url
                }

                setTimeout(() => {
                    closeAlert()
                    updateActiveOrganisationAirtimeQrCode(airtimeQrCode)
                }, 1500)
            }
        })
    }

    return (
        <div className="py-4 px-4 lg:px-6 2xl:px-10 mx-auto w-full space-y-3">
            <div className="w-full flex flex-col lg:flex-row items-start gap-y-2 lg:gap-y-0 lg:items-center">
                <Breadcrumbs variant="light" className="py-2 flex-1">
                    <BreadcrumbItem startContent={<Home13Icon/>}><Link href={"/"}>Accueil</Link></BreadcrumbItem>
                    <BreadcrumbItem startContent={<AiPhone02Icon/>}>Cabine intelligente</BreadcrumbItem>
                </Breadcrumbs>

                {activeOrganisation?.airtime_qrcode?.url && (
                    <Button onPress={() => setIsOpen(true)} className="self-center lg:self-auto"
                            startContent={<DownloadIcon/>}>Retirer les fonds</Button>
                )}
            </div>
            {!activeOrganisation?.airtime_qrcode?.url ? (
                <>
                    <div className="py-0">
                        <div className="flex items-center">
                            <h1 className="text-lg font-semibold md:text-2xl">Cabine Intelligente</h1>
                        </div>
                        <div
                            className="p-20 mt-4 flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm bg-default-200">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-3xl font-bold tracking-tight">
                                    Vous n&apos;avez pas encore de smart cabine.
                                </h3>
                                <p className="text-sm mb-4 mt-1 text-muted-foreground">
                                    Vous pourrez générer un code qr et un lien vers votre smart cabine en cliquant sur
                                    le bouton ci-dessous.
                                </p>
                                <Button
                                    isLoading={isCreateSmartkbinePending}
                                    onPress={handleCreateKbine}
                                    color="primary"
                                    isDisabled={isCreateSmartkbinePending}
                                    spinner={<ButtonSpinner/>}
                                >Ouvrir une smart cabine</Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-4">
                    <StatisticWidgetContainer wallet={activeOrganisation?.wallet}/>

                    <div className="flex justify-end lg:justify-between w-full flex-wrap gap-4 mt-6 mb-2 items-center">
                        <h3 className="text-xl hidden lg:block font-semibold">Cabine Intelligente</h3>
                        <div className="flex flex-row items-center gap-3.5 flex-wrap">
                            <CopyPaymentLink qrId={qrId} label="Copier le lien de la kbine"/>
                            <QrModal qrId={qrId}/>
                        </div>
                    </div>

                    <div className="w-full">
                        <SmartKineTransactions/>
                    </div>

                    {isOpen && (
                        <CashoutFounds
                            cashoutTypeList={cashoutTypeList}
                            isOpen={isOpen}
                            handleClose={() => setIsOpen(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
