'use client'

import {useMutation, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import {authService} from '@/services/auth.service';
import {useAuthStore} from '@/stores/authStore';
import {
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    SendOtpPayload,
    UserProfile,
    VerifyPayload
} from '@/types/auth.types';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {useAlertStore} from "@/stores/useAlert";

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const {setUser, setIsAuthenticated} = useAuthStore();
    const showAlert = useAlertStore(state => state.showAlert)
    const closeAlert = useAlertStore(state => state.closeAlert)

    const [canStepNext, setCanStepNext] = useState(false)

    const setupAutoLogout = () => {
        const LOGOUT_DELAY = 60 * 60 * 1000;

        const timer = setTimeout(async () => {
            await logout();
        }, LOGOUT_DELAY);

        return () => clearTimeout(timer);
    };

    useEffect(() => {
        if (useAuthStore.getState().isAuthenticated) {
            return setupAutoLogout();
        }
    }, [useAuthStore.getState().isAuthenticated]);

    const loginMutation = useMutation({
        mutationFn: (data: LoginPayload) => authService.login(data),
        onSuccess: (data) => {
            setIsAuthenticated(true)
            showAlert("Connexion réussie!", "success", true)
            setTimeout(() => {
                closeAlert()
                router.replace("/select-account")
            }, 1000)
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de la connexion", "error")
        }
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterPayload) => authService.register(data),
        onSuccess: () => {
            showAlert("OTP envoyé!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec lors de l'inscription", "error")
        }
    });

    const otpConfirmationMutation = useMutation({
        mutationFn: (data: VerifyPayload) => authService.otpConfirmation(data),
        onSuccess: () => {
            showAlert("Numéro de téléphone confirmé avec succès; Veuillez vous connecter!", "success")
            Cookies.remove("opt-confirmation")
            setTimeout(() => {
                closeAlert()
                router.replace('/login')
            }, 2500)
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de la vérification OTP", "error")
        }
    });

    const otpResendMutation = useMutation({
        mutationFn: (data: SendOtpPayload) => authService.otpResend(data),
        onSuccess: () => {
            showAlert("Nouveau code OTP envoyé!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de l'envoi du code OTP", "error")
        }
    });

    const forgotPasswordRequestMutation = useMutation({
        mutationFn: (data: ForgotPasswordPayload) => authService.forgotPasswordRequest(data),
        onSuccess: () => showAlert("Code OTP envoyé!", "success"),
        onError: (error: Error) => showAlert(error.message || "Échec de la demande", "error")
    });

    const forgotPasswordVerifyOtpMutation = useMutation({
        mutationFn: (data: VerifyPayload) => authService.forgotPasswordVerifyOtp(data),
        onSuccess: (data) => {
            localStorage.setItem('ResetPasswordToken', data.token);
            showAlert("Code OTP vérifié!", "success")
            router.push("/new-password")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de la vérification", "error")
        }
    });

    const forgotPasswordVerifyOtpResendMutation = useMutation({
        mutationFn: (data: VerifyPayload) => authService.forgotPasswordVerifyOtpResend(data),
        onSuccess: () => {
            showAlert("Nouveau code OTP envoyé!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de l'envoi du code OTP", "error")
        }
    });

    const forgotPasswordResetMutation = useMutation({
        mutationFn: (data: ResetPasswordPayload) => authService.forgotPasswordReset(data),
        onSuccess: () => {
            showAlert("Mot de passe réinitialisé avec succès!", "success")
            localStorage.removeItem('ResetPasswordToken');
            Cookies.remove("opt-confirmation")

            setTimeout(() => {
                closeAlert()
                router.push('/login')
            }, 3000)
        },
        onError: (error: Error) => {
            showAlert(error.message || "Échec de la réinitialisation", "error")
        }
    });

    const profileQuery: UseQueryResult<UserProfile, Error> = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const profile = await authService.getProfile();
            setUser(profile.user);
            return profile.user;
        },
        enabled: useAuthStore.getState().isAuthenticated,
    });

    const logout = async () => {
        await authService.logout();
        queryClient.clear();
        router.push('/login');
    };

    return {
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        otpConfirmation: otpConfirmationMutation.mutate,
        otpResend: otpResendMutation.mutate,
        forgotPasswordRequest: forgotPasswordRequestMutation.mutate,
        forgotPasswordVerifyOtp: forgotPasswordVerifyOtpMutation.mutate,
        forgotPasswordVerifyOtpResend: forgotPasswordVerifyOtpResendMutation.mutate,
        forgotPasswordReset: forgotPasswordResetMutation.mutate,
        logout,
        canStepNext,
        profile: profileQuery.data,
        isLoading: loginMutation.isPending ||
            registerMutation.isPending ||
            otpConfirmationMutation.isPending ||
            otpResendMutation.isPending ||
            forgotPasswordRequestMutation.isPending ||
            forgotPasswordVerifyOtpMutation.isPending ||
            forgotPasswordResetMutation.isPending ||
            profileQuery.isLoading,
    };
};
