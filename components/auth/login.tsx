"use client";
import {useLayoutEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Avatar, Button, Input} from "@heroui/react";
import Link from "next/link";
import {Eye, EyeOff} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {useCountry} from "@/hooks/useCountry";
import {LoginPayload} from "@/types/auth.types";
import {Alert} from "@/components/alert/alert";
import "react-phone-number-input/style.css";
import {AuthHeader} from "@/components/auth/auth-header";
import {AuthCard} from "@/components/auth/auth-card";

export const Login = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const {login, isLoading} = useAuth();

    const {countries} = useCountry();
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<LoginPayload>({
        defaultValues: {
            country_id: "52"
        }
    });

    const handleCountrySelect = (countryId: string | null) => {
        setValue("country_id", countryId || "52");
    };

    const onSubmit = async (data: LoginPayload) => {
        const cleanPhone = phoneNumber.replace(/\D/g, "").slice(-10);
        setValue("phone", cleanPhone);
        login(data);
    };

    useLayoutEffect(() => {
        localStorage.removeItem("auth-storage")
        localStorage.removeItem("organisation-storage")
    }, []);

    return (
        (<AuthCard>
            {/* Titre et Logo */}
            <AuthHeader title="Connexion à Aigle Business"/>
            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="">
                    {/* Sélection de pays et téléphone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Autocomplete
                            label="Sélectionner un pays"
                            onSelectionChange={handleCountrySelect}
                            defaultSelectedKey={watch("country_id")}
                            variant="bordered"
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
                                                    ? `https://flagcdn.com/${country?.isoTwo?.toLowerCase()}.svg`
                                                    : ""
                                            }
                                        />
                                    }
                                >
                                    {country.name}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>

                        {/* Champ téléphone */}
                        <Input
                            type="tel"
                            label="Numéro de téléphone"
                            {...register("phone", {required: true})}
                            maxLength={10}
                            inputMode="numeric"
                            variant="bordered"
                            isRequired
                        />
                    </div>

                    {/* Code PIN */}
                    <Input
                        {...register("password", {
                            required: true,
                            minLength: 6,
                            maxLength: 6,
                            pattern: /^[0-9]{6}$/ // Valide uniquement 6 chiffres
                        })}
                        type={isVisible ? "text" : "password"}
                        label="Code PIN (6 chiffres)"
                        variant="bordered"
                        isRequired
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="******"
                        endContent={
                            <button
                                type="button"
                                onClick={() => setIsVisible(!isVisible)}
                                className="focus-visible:outline-none"
                            >
                                {isVisible ? <EyeOff/> : <Eye/>}
                            </button>
                        }
                    />
                    <div className="flex justify-end w-full mt-1.5">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-blue-500 ml-1 mt-3 font-semibold"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>
                </div>

                {/* Bouton de soumission */}
                <div className="flex gap-4 mt-8">
                    <Button
                        type="submit"
                        color="primary"
                        className="block w-full text-lg text-foreground font-medium rounded-sm"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        Se connecter
                    </Button>
                </div>
            </form>
            {/* Lien pour s'inscrire */}
            <div className="text-neutral-600 dark:text-foreground-600 mt-8 text-sm text-center">
                <span>Vous n'avez pas encore de compte?{" "}</span>
                <Link href="/register" className="font-medium text-primary">
                    Créer votre compte ici
                </Link>
            </div>
            {/* Alertes */}
            <Alert/>
        </AuthCard>)
    );
};