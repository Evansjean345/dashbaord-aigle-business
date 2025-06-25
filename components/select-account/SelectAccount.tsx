"use client"

import React, {useEffect, useState} from 'react';
import {Autocomplete, AutocompleteItem, Button} from "@heroui/react";
import {useAuthOrganisations} from "@/hooks/useOrganisation";
import {useOrganisationStore} from "@/stores/organisationStore";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const SelectAccount = () => {
    const {authOrganisations, isAuthOrganisationLoading} = useAuthOrganisations()
    const activeOrganisation = useOrganisationStore(state => state.organisation)
    const setOrganisation = useOrganisationStore(state => state.setOrganisation)
    const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>()

    const router = useRouter()

    const handleSelected = (organisation_id) => {
        setSelectedOrganisation(organisation_id);
    };

    const handleNext = () => {
        if (!activeOrganisation) {
            toast.error("Vous devez sélectionner un compte")
            return
        }

        router.replace("/")
    }

    useEffect(() => {
        if (authOrganisations && authOrganisations.length === 1) {
            setOrganisation(authOrganisations[0])
            router.replace("/")
        }


        if (selectedOrganisation) { // Check if selectedOrganisation is not null
            const organisation = authOrganisations.find(item => item.organisation_id === selectedOrganisation);
            if (organisation) {
                setOrganisation(organisation);
            }
        }
    }, [selectedOrganisation, authOrganisations]);


    return (
        <div className="w-full h-[calc(100vh-30vh)] px-5 lg:px-10 flex justify-center items-center">
            <div className="max-w-full lg:max-w-2xl space-y-5 bg-white dark:bg-background rounded-lg border dark:border-neutral-800 py-7 lg:py-18 px-4 lg:px-8">
                <label htmlFor="" className="font-bold text-2xl  tracking-wide">Sélectionner un compte</label>
                <Autocomplete
                    label="Sélectionner un compte"
                    onSelectionChange={handleSelected}
                    variant="bordered"
                    isRequired
                >
                    {authOrganisations?.map((organisation) => (
                        <AutocompleteItem
                            key={organisation.organisation_id}
                            value={organisation.organisation_id}
                        >
                            {`${organisation.name}(${organisation.organisation_id})`}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>

                <div className="flex justify-end mt-3">
                    <Button
                        type="submit"
                        color="primary"
                        className="text-lg font-medium rounded-sm"
                        isDisabled={!selectedOrganisation}
                        onPress={handleNext}
                    >
                        Continuer
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SelectAccount;