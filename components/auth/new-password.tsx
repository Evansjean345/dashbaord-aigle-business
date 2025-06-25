"use client";

import {useEffect, useState} from "react";
import {Button, Input} from "@heroui/react";
import {useAuth} from "@/hooks/useAuth";
import {Alert} from "@/components/alert/alert";
import {AuthHeader} from "@/components/auth/auth-header";
import {AuthCard} from "@/components/auth/auth-card";
import {useRouter} from "next/navigation";
import {Eye, EyeOffIcon} from "lucide-react";
import Cookies from "js-cookie";
import {toast} from "sonner";


export const NewPassword = () => {
    const [newPass, setNewPass] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("52");
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    const {
        forgotPasswordReset,
        isLoading
    } = useAuth();

    const handleResetPassword = async () => {
        forgotPasswordReset({phone_number: phoneNumber, password: newPass, country_id: selectedCountry});
    };

    useEffect(() => {
        const savedData = Cookies.get("opt-confirmation");
        const token = localStorage.getItem("ResetPasswordToken")

        if (!savedData || !token) {
            toast.error("Vous ne pouvez pas accéder à cette resource", {duration: 3000});
            return router.back();
        }

        const userAccount = JSON.parse(savedData)
        setPhoneNumber(userAccount.phone)
        setSelectedCountry(userAccount.country_id)
    }, [])

    return (
        <AuthCard>
            <AuthHeader title="Réinitialisation du mot de passe"/>
            <div className="space-y-8">
                <div className="space-y-4 pt-8">
                    <Input
                        // {...register("password", {
                        //   required: true,
                        //   minLength: 6,
                        //   maxLength: 6,
                        //   pattern: /^[0-9]{6}$/
                        // })}
                        onChange={(e) => setNewPass(e.target.value)}
                        type={isVisible ? "text" : "password"}
                        label="Nouveau Code PIN (6 chiffres)"
                        variant="bordered"
                        isRequired
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="******"
                        endContent={
                            <button type="button" onClick={() => setIsVisible(!isVisible)}>
                                {isVisible ? <EyeOffIcon/> : <Eye/>}
                            </button>
                        }
                    />
                    <Button
                        color="primary"
                        onPress={handleResetPassword}
                        className="block w-full text-lg text-foreground font-medium rounded-sm"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        Changer le code pin
                    </Button>
                </div>
            </div>

            <Alert/>
        </AuthCard>
    );
};
