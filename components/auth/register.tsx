"use client";

import {useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Avatar, Button, Checkbox, cn, Input, Select, SelectItem} from "@heroui/react";
import React, {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {useCountry} from "@/hooks/useCountry";
import {RegisterPayload} from "@/types/auth.types";
import {Alert} from "@/components/alert/alert";
import "react-phone-number-input/style.css";
import Link from "next/link";
import {AuthHeader} from "@/components/auth/auth-header";
import {AuthCard} from "@/components/auth/auth-card";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {findCountry} from "@/lib/utils";
import {useAlertStore} from "@/stores/useAlert";

export const Register = () => {
    const [selectedCountry, setSelectedCountry] = useState('52');
    const {register: registerUser, isLoading} = useAuth();
    const {countries} = useCountry();
    const router = useRouter()
    const [selectedAccountType, setSelectedAccountType] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const showAlert = useAlertStore(state => state.showAlert)

    const {register, handleSubmit, watch, setValue, formState: {errors}} = useForm<RegisterPayload>({
        defaultValues: {
            country_id: selectedCountry,
        },
        mode: "onChange",
    });

    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setValue("country_id", selectedCountry);
    };

    const onSubmit = async (data: RegisterPayload) => {
        const CompanyPhone = watch("phone");
        if (isChecked === false) {
            showAlert('Veuillez accepter les conditions d\'utilisation', "error")
            return;
        }
        setValue('company_phone_number', CompanyPhone);
        registerUser({...data, company_phone_number: CompanyPhone, country_id: selectedCountry}, {
            onSuccess: () => {
                const searchedCountry = findCountry(countries, selectedCountry)
                if (searchedCountry) {
                    Cookies.set("opt-confirmation", JSON.stringify({
                        phone: CompanyPhone,
                        country_id: searchedCountry.id,
                        country_code: searchedCountry.phoneCode
                    }))
                    router.push("/register/confirm-otp")
                }
            }
        });
        return;
    };

    const handleAccountTypeChange = (e: { target: { value: string } } | string) => {
        const value = typeof e === 'string' ? e : e.target?.value;
        setSelectedAccountType(value);
        setValue('account_type', value);
    };

    return (
        (<AuthCard customClass="md:w-3/4 max-w-5xl">
            <AuthHeader title="Démarrez avec Aigle Business"/>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Autocomplete
                            label="Sélectionner un pays"
                            value={selectedCountry}
                            onSelectionChange={(countryId) => {
                                handleCountrySelect(countryId);
                                setValue("country_id", countryId);
                            }}
                            defaultSelectedKey={'52'}
                            variant="bordered"
                            // startContent={
                            //   selectedCountry && (
                            //     <Avatar
                            //       alt="Country Flag"
                            //       className="w-9 h-6"
                            //       src={`https://flagcdn.com/${selectedCountry.isoTwo}.svg`}
                            //     />
                            //   )
                            // }
                            isRequired
                        >
                            {countries?.map((country) => (
                                <AutocompleteItem
                                    key={country.id}
                                    value={country.id}
                                    startContent={
                                        <Avatar
                                            alt={country.name}
                                            className="w-6 h-6"
                                            src={
                                                country.isoTwo
                                                    ? `https://flagcdn.com/${country.isoTwo.toLowerCase()}.svg`
                                                    : ""
                                            }
                                        />
                                    }
                                >
                                    {country.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Select
                            label="Type de compte"
                            variant="bordered"
                            selectedKeys={[selectedAccountType]}
                            onChange={e => handleAccountTypeChange(e)}
                            isRequired
                        >
                            <SelectItem key="marchand">Marchand</SelectItem>
                            <SelectItem key="pdv">Distributeur</SelectItem>
                            <SelectItem key="enterprise">Entreprise</SelectItem>
                            <SelectItem key="school">Etablissement</SelectItem>
                        </Select>
                        <Input
                            {...register("company_name")}
                            label="Nom de l'entreprise'"
                            variant="bordered"
                            isRequired
                        />
                        <Input
                            {...register("phone", {required: true})}
                            label="Numéro de l'entreprise"
                            variant="bordered"
                            inputMode="numeric"
                            maxLength={15}
                            isRequired
                        />

                        <Input
                            {...register("fullname", {required: true})}
                            label="Nom du gérant"
                            variant="bordered"
                            isRequired
                        />
                        <Input
                            {...register("email", {required: true})}
                            label="Email du gérant"
                            type="email"
                            variant="bordered"
                            isRequired
                        />
                    </div>
                    <div className="grid grid-cols-1 mt-6">
                        <Input
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 6,
                                pattern: /^[0-9]{6}$/
                            })}
                            type={isVisible ? "text" : "password"}
                            label="Code PIN (6 chiffres)"
                            variant="bordered"
                            isRequired
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="******"
                            endContent={
                                <button type="button" onClick={() => setIsVisible(!isVisible)}>
                                    {isVisible ? <EyeOff/> : <Eye/>}
                                </button>
                            }
                        />
                    </div>
                    <div className="mx-2 my-5">
                        <Checkbox
                            radius="sm"
                            size="sm"
                            isRequired
                            onChange={(e) => {
                                setIsChecked(e.target.checked)
                            }}
                            classNames={{
                                base: cn(
                                    "inline-flex w-full bg-content2 text-sm",
                                    "hover:bg-content2 items-center justify-start",
                                    "cursor-pointer rounded-lg gap-2 p-1 border-2 border-transparent",
                                    "data-[selected=true]:bg-content2 my-2",
                                ),
                                label: "w-full",
                            }}
                        >Vous accepter les conditions générales d&apos;utilisation, les conditions de
                            confidentialité et les politiques de cookies de <span className="font-semibold">AIGLE BUSINESS.</span>
                        </Checkbox>
                    </div>
                </div>

                <div className="flex justify-between gap-4 mt-8">
                    <Button
                        type="submit"
                        color="primary"
                        className="flex items-center justify-center text-foreground w-full text-lg font-medium rounded-sm"
                        isDisabled={isLoading}
                        isLoading={isLoading}
                    >
                        S'inscrire
                    </Button>
                </div>
            </form>
            <div className="text-neutral-600 dark:text-foreground-600 mt-8 text-sm text-center">
                <span>Vous avez déjà un compte ?{""}{" "}</span>
                <Link href="/login" className="font-medium text-primary">
                    Connectez-vous ici
                </Link>
            </div>
            <Alert/>
        </AuthCard>)
    );
};
