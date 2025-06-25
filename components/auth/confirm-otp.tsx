"use client"

import {useEffect, useMemo, useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {AuthCard} from "@/components/auth/auth-card";
import {AuthHeader} from "@/components/auth/auth-header";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Button} from "@heroui/react";
import {Alert} from "@/components/alert/alert";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {useCountdownTimer} from "@/hooks/use-countdown-timer";
import {useAlertStore} from "@/stores/useAlert";

interface Props {
    type: "forgot-password" | "confirm-account"
}

export const ConfirmOtp = ({type}: Props) => {
    const router = useRouter()
    const [otpValue, setOtpValue] = useState("");
    const {
        otpConfirmation,
        otpResend,
        isLoading,
        forgotPasswordVerifyOtp,
        forgotPasswordVerifyOtpResend
    } = useAuth();
    const [userAccount, setUserAccount] = useState<{
        phone: string,
        country_id: number,
        country_code: string
    } | null>(null)

    const {timeLeft, canResend, startTimer} = useCountdownTimer(20);

    /**
     * Converts a number representing seconds into a formatted string.
     * If the number is less than 10, it prepends a leading zero to the value.
     *
     * @param {number} seconds - The number of seconds to format.
     * @returns {string|number} - A formatted string if the number is less than 10, otherwise the original number.
     */
    const formatTime = (seconds: number): string | number => (seconds < 10 ? `0${seconds}` : seconds);

    /**
     * Asynchronous function triggered upon form submission or similar interaction.
     *
     * This function performs the following actions in sequence:
     * 1. Calls the `verifyAccount` function to validate or verify the account details.
     * 2. Invokes the `otpConfirmation` function with relevant parameters including
     *    the user's phone number, the provided OTP value, and the country identifier.
     *
     * The purpose of this function is to handle logic related to validating and confirming
     * user account details during the submission process.
     *
     * Note: This function makes use of async/await to handle asynchronous operations.
     */
    const onSubmit = async () => {
        verifyAccount()

        if (type === "confirm-account") {
            otpConfirmation({
                phone_number: userAccount.phone,
                otp: Number.parseInt(otpValue),
                country_id: userAccount.country_id
            });
        }

        if (type === "forgot-password") {
            forgotPasswordVerifyOtp({
                phone_number: userAccount.phone,
                otp: Number.parseInt(otpValue),
                country_id: userAccount.country_id
            })
        }
    };
    /**
     * A callback function triggered when the user attempts to resend the OTP (One-time Password).
     * It initiates the process to verify the user's account and resend the OTP to the user's registered phone number.
     * Additionally, it temporarily disables the ability to resend the OTP for 30 seconds to prevent repeated requests.
     *
     * @function onResendOTP
     * @returns {void} No return value.
     */
    const onResendOTP = (): void => {
        verifyAccount()

        if (type === "confirm-account") {
            otpResend({phone_number: userAccount?.phone, country_id: userAccount.country_id}, {
                onSuccess: () => {
                    startTimer()
                }
            })
        }

        if (type === "forgot-password") {
            forgotPasswordVerifyOtpResend({phone_number: userAccount?.phone, country_id: userAccount.country_id}, {
                onSuccess: () => {
                    startTimer()
                }
            });
        }
    }

    const isDisabled = useMemo(() => {
        return otpValue.length !== 5 || isLoading
    }, [otpValue, isLoading])

    /**
     * A function to verify the existence of a user's account before performing an action.
     * If the user account does not exist, it triggers an error notification and halts execution.
     */
    const verifyAccount = () => {
        if (!userAccount) {
            const showAlert = useAlertStore.getState().showAlert;
            showAlert("Impossible d'effectuer cette action", "error");
            return
        }
    }

    useEffect(() => {
        const savedData = Cookies.get("opt-confirmation");
        if (!savedData) {
            const showAlert = useAlertStore.getState().showAlert;
            showAlert("Vous ne pouvez pas accéder à cette resource", "error");
            return router.back();
        }

        setUserAccount(JSON.parse(savedData));
    }, [router]);

    return (
        <>
            {userAccount && (<AuthCard customClass="md:w-3/4 max-w-5xl">
                <AuthHeader title="Confirmation de votre numéro"/>

                <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-center text-gray-600 dark:text-foreground-600">
                            Entrez le code envoyé au +{userAccount?.country_code}{userAccount?.phone} pour vérifier
                            votre numéro de téléphone.
                        </p>
                        <InputOTP
                            maxLength={5}
                            value={otpValue}
                            onChange={(value) => setOtpValue(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0}/>
                                <InputOTPSlot index={1}/>
                                <InputOTPSlot index={2}/>
                                <InputOTPSlot index={3}/>
                                <InputOTPSlot index={4}/>
                            </InputOTPGroup>
                        </InputOTP>
                        <div className="text-center text-sm text-gray-500 dark:text-foreground-500">
                            {otpValue === "" ? (
                                <>Entrez le code de vérification</>
                            ) : (
                                <>Code saisi: {otpValue}</>
                            )}
                        </div>
                        <Button
                            variant={canResend ? "bordered" : "light"}
                            onPress={onResendOTP}
                            className="mt-4 flex items-center"
                            isDisabled={isLoading || !canResend}
                        >
                            {canResend && <span>Vous n&apos;avez pas reçu le code? Renvoyer le code</span>}
                            {!canResend && <span>Renvoyer le code dans {formatTime(timeLeft)}s</span>}
                        </Button>
                    </div>
                    <div className="flex justify-between gap-4 mt-8">
                        <Button
                            type="submit"
                            color="primary"
                            className="flex items-center dark:text-foreground justify-center w-full cursor-pointer text-lg font-medium rounded-sm"
                            disabled={isDisabled}
                            onPress={onSubmit}
                        >
                            Confirmer
                        </Button>
                    </div>
                </div>
                <Alert/>
            </AuthCard>)}
        </>
    );
}
