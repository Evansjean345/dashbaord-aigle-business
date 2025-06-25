import React from 'react';
import Widget from "@/components/kbine/widget";
import {CoinsIcon, WalletMinimalIcon} from "lucide-react";
import {Wallet} from "@/types/organisation.types";
import {ArrowDataTransferHorizontalIcon} from "hugeicons-react";

interface Props {
    wallet: Wallet
}

export const StatisticWidgetContainer = ({wallet}: Props) => {
    return (
        <div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-3 lg:gap-y-0 lg:gap-x-3">
                <Widget
                    title='Solde principal'
                    amount={wallet.balance}
                    textColor="text-green-400"
                    icon={<WalletMinimalIcon className="text-green-400"/>}
                />
                <Widget
                    title='Solde collecte'
                    amount={wallet.collect ?? 0}
                    textColor="text-orange-400"
                    icon={<ArrowDataTransferHorizontalIcon className="text-orange-400"/>}
                />
                <Widget
                    title='Commission'
                    amount={wallet.airtimeCommission ?? 0}
                    textColor="text-blue-400"
                    icon={<CoinsIcon className="text-blue-400"/>}
                />
            </div>
        </div>
    );
};

export default StatisticWidgetContainer;