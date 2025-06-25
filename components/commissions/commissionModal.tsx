import React, {useState} from "react";
import {CashoutFounds} from "@/components/kbine/cashoutFounds";
import {CashoutType} from "@/types/transaction.types";

interface Props {
    isOpen: boolean;
    handleClose: () => void;
}

const cashoutTypeList: CashoutType[] = [
    {label: "Commission", value: "revenue_commission"},
]

export const CommissionModalComponent = ({isOpen, handleClose}: Props) => {
    if (!isOpen) return null;

    return (
        <CashoutFounds
            cashoutTypeList={cashoutTypeList}
            isOpen={isOpen}
            handleClose={handleClose}
        />
    );
};
