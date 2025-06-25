"use client";
import {useState} from "react";
import {Autocomplete, AutocompleteItem, Avatar, Button, Input,} from "@heroui/react";
import {useAuth} from "@/hooks/useAuth";
import {useCountry} from "@/hooks/useCountry";
import {Alert} from "@/components/alert/alert";
import {AuthHeader} from "@/components/auth/auth-header";
import {AuthCard} from "@/components/auth/auth-card";
import {findCountry} from "@/lib/utils";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {useAlertStore} from "@/stores/useAlert";


export const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [newPass, setNewPass] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("52");
    const {countries} = useCountry();
    const router = useRouter()

    const showAlert = useAlertStore(state => state.showAlert)

    const {
        forgotPasswordRequest,
        forgotPasswordReset,
        isLoading,
    } = useAuth();
    const [formaData, setFormData] = useState({
        country_id: "",
        phone: "",
        otp: "",
    });

    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
    };

    const handlePhoneSubmit = async () => {
        const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length !== 10) {
            showAlert("Le numéro de téléphone doit contenir exactement 10 chiffres", "error")
            return;
        }
        forgotPasswordRequest({phone_number: cleanPhone, country_id: selectedCountry}, {
            onSuccess: () => {
                const searchedCountry = findCountry(countries, selectedCountry)
                if (searchedCountry) {
                    Cookies.set("opt-confirmation", JSON.stringify({
                        phone: phoneNumber,
                        country_id: searchedCountry.id,
                        country_code: searchedCountry.phoneCode
                    }))
                    router.push("/forgot-password/confirm-otp")
                }
            }
        });
    };

    /**
     * Handles the reset password functionality by cleaning the phone number,
     * calling the forgotPasswordReset API with the cleaned phone number, new password, and selected country ID,
     * and setting the step to 4.
     * This is an asynchronous function.
     */
    const handleResetPassword = async () => {
        const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
        forgotPasswordReset({phone_number: cleanPhone, password: newPass, country_id: selectedCountry});
        setStep(4);
    };

    return (
        <AuthCard>
            <AuthHeader title="Réinitialisation du mot de passe"/>
            <div className="space-y-8">
                <div className="space-y-4">
                    <Autocomplete
                        label="Sélectionner un pays"
                        value={selectedCountry}
                        onSelectionChange={(countryId) => {
                            handleCountrySelect(countryId);
                        }}
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
                    <Input
                        type="tel"
                        label="Numéro de téléphone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={10}
                        inputMode="numeric"
                        variant="bordered"
                    />
                    <Button
                        color="primary"
                        onPress={handlePhoneSubmit}
                        isLoading={isLoading}
                        isDisabled={isLoading}
                        className="block w-full text-lg text-foreground font-medium rounded-sm">
                        Envoyer le code
                    </Button>
                </div>
            </div>

            <Alert/>
        </AuthCard>
    );
};
