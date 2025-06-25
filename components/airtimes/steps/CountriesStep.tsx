import React from 'react';
import {Autocomplete, AutocompleteItem, Avatar, Spinner} from "@heroui/react";
import {Countries} from "@/types/airtimes.types";

interface Props {
    selectedCountry: string,
    isLoadingCountries: boolean,
    countries: Countries[]
    handleSelectedCountryChange: (selectedCountry: string) => void,
}

export const CountriesStep = ({countries, isLoadingCountries, selectedCountry, handleSelectedCountryChange}: Props) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold ">Sélection du pays</h3>
            <Autocomplete
                label="Sélectionner un pays"
                value={selectedCountry}
                onSelectionChange={(country: string) => handleSelectedCountryChange(country)}
                variant="bordered"
                defaultSelectedKey={selectedCountry ?? "CI"}
                startContent={
                    selectedCountry && (
                        <Avatar
                            alt="Country Flag"
                            className="w-6 h-6 "
                            src={`https://flagcdn.com/${selectedCountry?.toLowerCase()}.svg`}
                        />
                    )
                }
                isRequired
            >
                {isLoadingCountries ? (
                    <AutocompleteItem key='loading' value='loading'>
                        <div className="flex justify-center items-center  h-40">
                            <Spinner color="primary"/>
                        </div>
                    </AutocompleteItem>
                ) : countries?.map((country: Countries) => (
                    <AutocompleteItem
                        key={country.iso_name}
                        value={country.iso_name}
                        startContent={
                            <Avatar
                                alt={country.name}
                                className="w-6 h-6"
                                src={country.flag}
                            />
                        }
                    >
                        {country.name}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
};