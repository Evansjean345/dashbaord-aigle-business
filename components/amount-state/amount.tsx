import {useOrganisationStore} from "@/stores/organisationStore";

export const AmountState = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);

    return (
        <div className="flex flex-col md:flex-row justify-end md:items-center mb-1">
            <div className="text-left md:text-right">
                <h3 className="text-lg">Solde principal</h3>
                <p className="text-2xl font-bold text-success">{activeOrganisation?.wallet.balance ?? 0} FCFA</p>
            </div>
        </div>
    )
}