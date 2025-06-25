import React from "react";
import Image from "next/image";
import {Chip} from "@heroui/react";
import {Transaction} from "@/types/transaction.types";
import {Actions} from './actions';
import {getNestedValue} from "@/lib/utils";
import {statusColorMap, statusTranslations, transactionService} from "@/lib/transaction_config";
import {ActiveOrganisation} from "@/types/organisation.types";

interface Props {
    transaction: Transaction;
    columnKey: string | React.Key;
    organisation: ActiveOrganisation;
}

const renderTransfertCategory = (category: string, organisation: ActiveOrganisation, transactionType: string): string => {
    const transfertCategories: Record<string, string> = {
        revenue: organisation.account_type === "marchand" ? "Destockage" : "Transfert",
        airtime_revenue: "Retrait fonds kbine",
        revenue_commission: "Retrait commission",
        airtime_commission: "Retrait commission kbine"
    };

    if (transactionType == "withdrawal") {
        switch (organisation.account_type) {
            case "school":
                return "Règlement scolaire"
            default:
                return "Encaissement"
        }
    }

    return transfertCategories[category] ?? category;
};

const renderGenericCell = (cellValue: unknown) => (
    <div className="flex flex-col">
        <p className="text-bold text-small capitalize">{cellValue}</p>
    </div>
);

export const RenderCell: React.FC<Props> = ({transaction, columnKey, organisation}) => {
    const cellValue = columnKey.toString().includes('.')
        ? getNestedValue(transaction, columnKey.toString())
        : transaction[columnKey as keyof Transaction];

    const renderMap: Record<string, () => React.ReactNode> = {
        amount: () => renderGenericCell(`${transaction.amount} FCFA`),

        "transactionFees.amount": () => (
            renderGenericCell(`${Number.parseInt(transaction?.transactionFees?.amount) || 0} FCFA`)
        ),

        "paymentDetails.provider": () => (
            <div className="flex flex-col gap-y-1 items-center">
                <Image
                    src={`/img/${transaction.paymentDetails?.provider}.png`}
                    className="rounded-full"
                    alt="provider"
                    width={28}
                    height={28}
                />
                <span className="text-sm">{transaction.paymentDetails?.provider}</span>
            </div>
        ),

        "paymentDetails.service": () => (
            <span className="text-sm">{transactionService[transaction.paymentDetails?.service]}</span>
        ),

        createdAt: () => {
            if (!cellValue) return null;
            const date = new Date(cellValue as string);
            return (
                <div className="flex flex-col text-sm">
                    <p className="text-bold text-small capitalize">
                        {date.toLocaleDateString()}
                    </p>
                    <p className="text-bold text-small capitalize">
                        {date.toLocaleTimeString()}
                    </p>
                </div>
            );
        },

        status: () => (
            <Chip
                size="sm"
                variant="solid"
                color={statusColorMap[cellValue as string] || "default"}
            >
                <span className="lowercase text-white text-xs">
                    {statusTranslations[cellValue as string] || ""}
                </span>
            </Chip>
        ),

        actions: () => (
            <div className="flex items-center gap-4">
                <Actions transaction={transaction}/>
            </div>
        ),

        category: () => (
            <div>{renderTransfertCategory(cellValue as string, organisation, transaction.transactionType)}</div>
        )
    };

    const paymentDetailsColumns = [
        "paymentDetails.transactionId",
        "paymentDetails.reference",
        "paymentDetails.customerPhone"
    ];

    if (paymentDetailsColumns.includes(columnKey.toString())) {
        return renderGenericCell(cellValue);
    }

    return renderMap[columnKey.toString()]?.() ?? cellValue;
};
