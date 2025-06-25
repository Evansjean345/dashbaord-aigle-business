import React from "react";
import {Actions} from "./actions";
import {Organisation} from "@/types/organisation.types";

interface Props {
    organisation: Organisation;
    columnKey: string | React.Key;
}

export const RenderCell = ({organisation, columnKey}: Props) => {

    if (columnKey.toString().includes('wallet.')) {
        const nestedKey = columnKey.toString().split('.')[1];
        const cellValue = organisation.wallet?.[nestedKey as keyof typeof organisation.wallet];
        return cellValue;
    }

    // @ts-ignore
    const cellValue = organisation[columnKey];
    switch (columnKey) {

        case "wallet.balance":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">
                        {organisation.wallet.balance} FCFA
                    </p>
                </div>
            );
        case "actions":
            return (
                <>
                    <div className="flex items-center gap-4 ">
                        <div>
                            <Actions organisation={organisation}/>
                        </div>
                    </div>
                </>
            );
        default:
            return cellValue;
    }
};
