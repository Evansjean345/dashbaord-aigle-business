import React from 'react';
import {Autocomplete, AutocompleteItem, Avatar, Card, CardBody, Spinner} from "@heroui/react";
import Image from "next/image";

interface Props {
    countries: any[],
    isLoadingOperators: boolean,
    operators: any[],
    operatorValue: any
    handleOperatorSelect: (operator_id: any) => void,
    handleCountrySelect: (country_id: any) => void
}

export const CountriesOperators = ({
                                       countries,
                                       operators,
                                       operatorValue,
                                       isLoadingOperators,
                                       handleCountrySelect,
                                       handleOperatorSelect
                                   }: Props) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choisissez le pays et l&apos;opérateur</h3>

            <Autocomplete
                label="Sélectionner un pays"
                onSelectionChange={(countryId) => {
                    handleCountrySelect(countryId);
                }}
                defaultSelectedKey={'CI'}
                variant="bordered"
                isRequired
            >
                {countries?.map((country) => (
                    <AutocompleteItem
                        key={country.code}
                        value={country.code}
                        startContent={
                            <Avatar
                                alt={country.name}
                                className="w-6 h-6"
                                src={`https://flagcdn.com/${country?.code?.toLowerCase()}.svg`}
                            />
                        }
                    >
                        {country.name}
                    </AutocompleteItem>
                ))}
            </Autocomplete>

            <div className="grid grid-cols-2 gap-4">
                {isLoadingOperators ? (
                    <Spinner size="lg" className="w-full h-full"/>
                ) : operators?.map((network) => (
                    <Card
                        key={network.name}
                        isPressable
                        onPress={() => handleOperatorSelect(network.name.toLowerCase())}
                        className={`border-2 ${operatorValue === network?.name?.toLowerCase() ? 'border-primary bg-primary-100' : 'border-transparent'}`}
                    >
                        <CardBody className="flex flex-col items-center p-4">
                            <Image
                                src={`/img/${network?.name?.toLowerCase()}.png` || '/img/phone-call.png'}
                                alt={network.name}
                                width={40}
                                height={40}
                                className="mb-2 rounded-md"
                            />
                            <span className="text-sm font-medium">{network.name}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};