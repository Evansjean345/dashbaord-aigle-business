'use client'

import {useQuery} from '@tanstack/react-query';
import {getCountries} from '@/services/country.service'

export const useCountry = () => {
    const {data: countries, isLoading: isLoadingCountries} = useQuery({
        queryKey: ["countries"],
        queryFn: async () => await getCountries()
    });

    return {
        countries,
        isLoadingCountries,
    };
}