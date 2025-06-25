"use client";
import {useState} from "react";
import {useAuth} from "@/hooks/useAuth";

export const ActiveAccount = () => {
    const [otpValue, setOtpValue] = useState("");
    const {forgotPasswordVerifyOtpResend, isLoading, alertState, setAlertState} = useAuth();
}