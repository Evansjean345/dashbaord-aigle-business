import {create} from "zustand";
import {Countries, Operators} from "@/types/airtimes.types";

interface AirtimeStore {
    airtimes: any[];
    countries: Countries[];
    operators: Operators[];
    addAirtime: (airtime: any) => void;
    getCountries: () => Countries[];
    getOperators: (countryCode: string) => Operators[];
}

export const useAirtimeStore = create<AirtimeStore>()((set, get) => ({
    airtimes: [],
    countries: [],
    operators: [],
    getCountries: () => {
        return get().countries;
    },
    getOperators: (countryCode: string) => {
        return get().operators.filter(
            (operator) => operator.country.isonName === countryCode
        );
    },
    addAirtime: (airtime) => {
        set((state) => ({airtimes: [...state.airtimes, airtime]}));
    }
}));
