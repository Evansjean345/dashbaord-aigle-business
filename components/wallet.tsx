import React from 'react';
import Widget from "@/components/kbine/widget";
import {CoinsIcon, WalletMinimalIcon} from "lucide-react";
import { useOrganisationStore } from '@/stores/organisationStore';

export const Wallet = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation)
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Widget
                title='Solde principal'
                amount={activeOrganisation?.wallet?.balance ?? 0}
                textColor="text-green-400"
                icon={<WalletMinimalIcon className="text-green-400"/>}
            />
            {activeOrganisation?.account_type === "pdv" && (
                <Widget
                    title='Commission'
                    amount={activeOrganisation?.wallet.commission ?? 0}
                    textColor="text-blue-400"
                    icon={<CoinsIcon className="text-blue-400"/>}
                />
            )}
        </div>
    );
};

export default Wallet