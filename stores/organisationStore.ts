import {create} from "zustand";
import {persist} from "zustand/middleware";
import {ActiveOrganisation, Wallet} from "@/types/organisation.types";
import {AirtimesQrcode} from "@/types/auth.types";

interface OrganisationStore {
    organisation: ActiveOrganisation | null,
    setOrganisation: (organisation: ActiveOrganisation) => void,
    updateOrganisationWallet: (wallet: Wallet) => void,
    updateOrganisationAirtime: (airtimesQrcode: AirtimesQrcode) => void,
}

/**
 * Represents an organised storage object with specific methods to interact with it.
 * @typedef {Object} useOrganisationStore
 * @property {function} setOrganisation - Function to set the selected organisation in the store.
 * @property {function} updateOrganisationWallet - Function to update the wallet of the organisation in the store.
 */
export const useOrganisationStore = create<OrganisationStore>()(
    persist(
        (set, get) => ({
            organisation: null,
            setOrganisation: (selectedOrganisation: ActiveOrganisation) => set({organisation: selectedOrganisation}),
            updateOrganisationWallet: (wallet: Wallet) => set((state) => ({
                ...state,
                organisation: {
                    ...state.organisation,
                    wallet: wallet
                }
            })),
            updateOrganisationAirtime: (airtimesQrcode: AirtimesQrcode) => set((state) => ({
                ...state,
                organisation: {
                    ...state.organisation,
                    airtime_qrcode: airtimesQrcode
                }
            }))
        }),
        {
            name: 'organisation-storage',
        }
    )
);
