import {Chip} from "@heroui/react";
import React from "react";
import Image from "next/image";
import {AirtimeTransaction} from "@/types/transaction.types";
import {Actions} from './actions'
import {getNestedValue} from "@/lib/utils";
import {statusColorMap, statusTranslations, transactionService} from "@/lib/transaction_config";

interface Props {
    transaction: AirtimeTransaction;
    columnKey: string | React.Key;
}

export const RenderCell = ({transaction, columnKey}: Props) => {
    const cellValue = columnKey.toString().includes('.')
        ? getNestedValue(transaction, columnKey.toString())
        : transaction[columnKey as keyof AirtimeTransaction];

    switch (columnKey) {
        case 'amount':
            return (
                <div className="flex flex-col text-semibold text-base">
                    <span className="">{transaction.amount} FCFA</span>
                </div>
            );
        case "transactionDetails.senderDetails.service":
            return (
                <span
                    className="text-sm">{transactionService[transaction.transactionDetails?.senderDetails?.service]}</span>
            );
        case 'transactionDetails.senderDetails.provider':
            return (
                <div className="flex justify-center">
                    <Image
                        src={`/img/${cellValue ? transaction?.transactionDetails?.senderDetails?.provider : "aig-b"}.png`}
                        alt="provider"
                        className="rounded-full"
                        width={transaction?.transactionDetails?.senderDetails.service === "aigle" ? 50 : 28}
                        height={transaction?.transactionDetails?.senderDetails.service === "aigle" ? 50 : 28}
                    />
                </div>
            );

        case "createdAt":
            return (
                <div className="flex flex-col text-base font-semibold">
                    <p className="text-bold text-small capitalize">
                        {new Date(cellValue as string).toLocaleDateString()}
                    </p>
                    <p className="text-bold text-small capitalize">
                        {new Date(cellValue as string).toLocaleTimeString()}
                    </p>
                </div>
            );

        case "status":
            return (
                <Chip
                    size="sm"
                    variant="solid"
                    color={statusColorMap[cellValue as string] || "default"}
                >
                    <span className="lowercase text-white text-xs">
                        {statusTranslations[cellValue as string] || ""}
                    </span>
                </Chip>
            );

        case "actions":
            return (
                <div className="flex items-center gap-4">
                    <Actions transaction={transaction}/>
                </div>
            );

        default:
            return cellValue;
    }
};
