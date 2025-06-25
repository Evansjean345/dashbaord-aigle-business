"use client";

import {useForm} from "react-hook-form";
import {Button, Input} from "@heroui/react";
import Link from "next/link";
import {useState} from "react";
import {ArrowLeft, ArrowRight, Eye, EyeOff, Loader2} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Alert} from "@/components/alert/alert";
import PhoneInput from 'react-phone-number-input';
import {SMSService} from "@/services/sms.service";
import "react-phone-number-input/style.css";
import Image from "next/image";
import {Alert02Icon, Tick04Icon} from "hugeicons-react"

type LoginFormData = {
    phone: string;
    password: string;
};

export const Login = () => {
    const [step, setStep] = useState(1);
    const [otpValue, setOtpValue] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [canResendOTP, setCanResendOTP] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const {login, isLoading} = useAuth();

    const {register, handleSubmit, setValue, formState: {errors}} = useForm<LoginFormData>();

    const sendVerificationCode = async (phone: string) => {
        setCanResendOTP(false);
        const result = await SMSService.sendVerificationCode(phone);
        if (result.success) {
            setVerificationCode(result.code);
            setTimeout(() => setCanResendOTP(true), 30000);
            return true;
        }
        return false;
    };

    const onSubmit = async (data: LoginFormData) => {
        if (step === 1) {
            const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

            if (cleanPhone.length !== 10) {
                setAlertState({
                    isOpen: true,
                    status: 'error',
                    message: 'Le numéro de téléphone doit contenir exactement 10 chiffres'
                });
                return;
            }

            setValue('phone', cleanPhone);
            const sent = await sendVerificationCode(phoneNumber);
            if (sent) setStep(2);
        } else if (step === 2) {
            if (otpValue !== verificationCode) {
                setAlertState({
                    isOpen: true,
                    status: 'error',
                    message: 'Code de vérification incorrect'
                });
                return;
            }
            setStep(3);
            setIsSubmitting(true);
            try {
                await login(data);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    return (
        <div className="w-full md:w-2/3 border-1 border-gray-400 max-w-3xl mx-auto p-8  rounded-lg shadow-lg">
            <div className=" text-[25px] font-bold mb-8 mx-auto text-center justify-center flex items-center">
                <Image
                    className='rounded-full'
                    src="/img/aig-b.png"
                    alt='logo'
                    width={100}
                    height={100}
                />
                {step === 1 && "Connexion a Aigle Business"}
                {step === 2 && "Vérification"}
                {step === 3 && "Finalisation"}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <PhoneInput
                            defaultCountry="CI"
                            placeholder="Numéro de téléphone"
                            value={phoneNumber}
                            onChange={value => setPhoneNumber(value || "")}
                            className="w-full border-2 border-gray-200 rounded-lg p-2"
                        />
                        <Input
                            type={isVisible ? "text" : "password"}
                            label="Mot de passe"
                            {...register("password")}
                            variant="bordered"
                            isRequired
                            endContent={
                                <button className="focus:outline-none" type="button"
                                        onClick={() => setIsVisible(!isVisible)}>
                                    {isVisible ? <EyeOff/> : <Eye/>}
                                </button>
                            }
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 flex flex-col items-center justify-center">
                        <p className="text-center text-gray-600">
                            Entrez le code envoyé au {phoneNumber}
                        </p>
                        <InputOTP
                            maxLength={6}
                            value={otpValue}
                            onChange={(value) => setOtpValue(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0}/>
                                <InputOTPSlot index={1}/>
                                <InputOTPSlot index={2}/>
                                <InputOTPSlot index={3}/>
                                <InputOTPSlot index={4}/>
                                <InputOTPSlot index={5}/>
                            </InputOTPGroup>
                        </InputOTP>
                        <div className="text-center text-sm text-gray-500">
                            {otpValue === "" ? (
                                <>Entrez le code de vérification</>
                            ) : (
                                <>Code saisi: {otpValue}</>
                            )}
                        </div>
                        {canResendOTP && (
                            <Button
                                variant="light"
                                onClick={() => sendVerificationCode(phoneNumber)}
                                className="mt-4"
                            >
                                Vous n&apos;avez pas reçu le code ? Renvoyer
                            </Button>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-4">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mx-auto h-12 w-12 text-primary"/>
                                <p className="text-lg font-medium">
                                    Votre demande est en cours de traitement...
                                </p>
                            </>
                        ) : alertState.status === "success" ? (
                            <div className="text-center space-y-4">
                                <Tick04Icon className="text-green-500 mx-auto h-12 w-12"/>
                                <p className="text-lg font-medium">
                                    {alertState.message}
                                </p>

                            </div>) : alertState.status === "error" && (
                            <div className="text-center space-y-4">
                                <Alert02Icon className="text-red-500 mx-auto h-12 w-12"/>
                                <p className="text-sm">
                                    {alertState.message}
                                </p>
                            </div>
                        )
                        }
                    </div>
                )}

                <div className="flex justify-between gap-4 mt-8">
                    {step > 1 && (
                        <Button
                            type="button"
                            variant="bordered"
                            onClick={handleBack}
                            startContent={<ArrowLeft size={20}/>}
                        >
                            Retour
                        </Button>
                    )}
                    <Button
                        type="submit"
                        color="primary"
                        disabled={isLoading}
                        endContent={step < 3 && <ArrowRight size={20}/>}
                    >
                        {step === 1 && "Suivant"}
                        {step === 2 && "Vérifier"}
                        {step === 3 && "Vous y êtes presque !"}
                    </Button>
                </div>
            </form>

            <div className="font-light text-slate-400 mt-8 text-sm text-center">
                Vous n&apos;avez pas encore de compte ?{" "}
                <Button variant="light" className="p-1 bg-transparent">
                    <Link href="/register" className="font-bold">
                        Inscrivez-vous ici
                    </Link>
                </Button>
            </div>

            <Alert/>
        </div>


    );
};
