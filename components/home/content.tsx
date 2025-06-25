"use client";

import React from "react";
import {ActivityCard} from './activity';
import {Card, CardBody} from "@heroui/react";
import {Chart} from "./chart"
import {CardWalletStart} from './quick-walllet-start'
import Widget from "@/components/kbine/widget";
import {MoneyReceive02Icon, MoneySend02Icon} from "hugeicons-react";
import {useTransactionAnalyzeChart, useTransactionSummary} from "@/hooks/transactionStatics";
import {useAuthOrganisations} from "@/hooks/useOrganisation";
import {useOrganisationStore} from "@/stores/organisationStore";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ActiveOrganisation} from "@/types/organisation.types";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";

export const Content = () => {
    const {transactionAnalyzeChart, updateSelectedDate} = useTransactionAnalyzeChart()
    const {organisation, setOrganisation} = useOrganisationStore()
    const {transactionSummary} = useTransactionSummary()
    const {authOrganisations} = useAuthOrganisations()
    const router = useRouter()

    const query = useQueryClient()

    /**
     * Function that handles the selection of an organization.
     * @param {number} organisation_id - The ID of the selected organization.
     */
    const handleSelected = async (organisation_id: number) => {
        const selectedOrg = authOrganisations.find(org => org.organisation_id === organisation_id)
        if (!selectedOrg) {
            toast.error("Une erreur est survenue")
            return
        }

        setOrganisation(selectedOrg)

        setTimeout(async () => {
            await query.invalidateQueries({queryKey: ["transaction-summary"]})
        }, 300)
    }

    return (
        <div className="max-h-[calc(100vh-150px)] lg:px-6 2xl:px-10">
            {authOrganisations && authOrganisations.length > 0 && (
                <div className="mt-3 flex w-full lg:w-auto justify-start lg:justify-end">
                    <div className="w-full lg:w-[250px] px-4 lg:px-0 mb-3 lg:mb-0">
                        <div className="flex items-center gap-x-1">
                            <h3 className="text-[0.877rem] font-semibold mb-1.5">Changer de compte</h3>
                        </div>
                        <Select
                            defaultValue={organisation?.organisation_id}
                            onValueChange={handleSelected}
                        >
                            <SelectTrigger
                                className="rounded-lg outline-none active:outline-none active:ring-none focus:outline-none">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {authOrganisations?.map((item: ActiveOrganisation) => (
                                        <SelectItem
                                            value={item.organisation_id}
                                            key={item.organisation_id}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
            <div
                className="flex justify-center gap-4 xl:gap-6 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-4 mx-auto w-full">
                <div className=" gap-6 flex flex-col w-full lg:w-2/3 2xl:w-3/4">
                    <div className="grid md:grid-cols-2 gap-x-4 grid-cols-1 gap-y-3 lg:gap-y-0 2xl:grid-cols-2 w-full">
                        <Widget
                            title="Entrées" textColor="text-emerald-500"
                            icon={<MoneyReceive02Icon className="text-emerald-500 "/>}
                            amount={transactionSummary ? transactionSummary.withdrawalTotal : 0}
                        />
                        <Widget
                            title="Sorties" textColor="text-orange-500"
                            icon={<MoneySend02Icon className="text-orange-500"/>}
                            amount={transactionSummary ? transactionSummary.payoutTotal : 0}
                        />
                    </div>
                    <div className="h-full flex flex-col gap-2">
                        <Chart
                            data={transactionAnalyzeChart}
                            handleDateRangeSelected={(date) => updateSelectedDate(date)}
                        />
                    </div>
                </div>

                {/* Left Section */}
                <div className="order-first md:order-last gap-2  flex flex-col max-h-full w-full lg:w-1/3 2xl:w-1/4 ">
                    <div
                        className="flex flex-col justify-center gap-0 flex-wrap md:flex-nowrap md:flex-col overflow-x-hidden">
                        <Card
                            className="bg-white dark:bg-background rounded-xl p-0 shadow-xs border-1 w-full overflow-y-auto overflow-x-hidden ">
                            <CardBody className="gap-y-6 p-0">
                                <CardWalletStart/>
                                <ActivityCard
                                    transactions={transactionSummary ? transactionSummary.recentTransactions : []}/>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}