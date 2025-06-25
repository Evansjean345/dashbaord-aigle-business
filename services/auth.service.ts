import {api, resetPasswordApi} from '@/lib/axios';
import {
    LoginPayload,
    RegisterPayload,
    UserProfile,
    VerifyPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
    ResetPasswordResponse,
    VerifyResponse
} from '@/types/auth.types';

import Cookies from "js-cookie"
import {ActiveOrganisation} from "@/types/organisation.types";
import { errorService } from "./error.service";

const COOKIE_OPTIONS = {
    expires: 7, // Expire dans 7 jours
    secure: false, // Secure en production
    sameSite: 'lax' as const,
    path: '/'
};

export const authService = {
    register: async (data: RegisterPayload) => {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || "Impossible de vous inscrire");
        }
    },

    login: async (data: LoginPayload) => {
        try {
            const response = await api.post('/auth/login', data);
            Cookies.set('auth_token', response.data.value, COOKIE_OPTIONS)
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(
                error.response?.data?.message === "Invalid user credentials" ? "le numéro de téléphone ou le mot de passe est incorrecte " : error.response?.data?.message || "Impossible de vous connecter"
            );
        }
    },

    logout: async () => {
        try {
            await api.get('/auth/logout');
            Cookies.remove('auth_token');
            localStorage.removeItem("auth-storage")
            localStorage.removeItem("organisation-storage")
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.response?.data?.message || "Impossible de vous déconnecter");
        }
    },


    otpConfirmation: async (data: VerifyPayload): Promise<VerifyResponse> => {
        try {
            const response = await api.post('/auth/register/otp/confirmation', data);
            return response.data;
        } catch (error: any) {
            console.error('OTP confirmation error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de la vérification du code otp");
        }
    },

    otpResend: async (data: VerifyPayload): Promise<VerifyResponse> => {
        try {
            const response = await api.post('/auth/register/otp/resend', data);
            return response.data;
        } catch (error: any) {
            console.error('OTP resend error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de l'envoier du code de vérification");
        }
    },

    forgotPasswordRequest: async (data: ForgotPasswordPayload): Promise<VerifyResponse> => {
        try {
            const response = await api.post('/auth/forgot-password/request', data);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password request error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de l'envoier du code de vérification");
        }
    },

    forgotPasswordVerifyOtp: async (data: VerifyPayload): Promise<ResetPasswordResponse> => {
        try {
            const response = await api.post('/auth/forgot-password/verify-otp', data);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password OTP verification error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de la vérification du code otp");
        }
    },

    forgotPasswordVerifyOtpResend: async (data: VerifyPayload): Promise<ResetPasswordResponse> => {
        try {
            const response = await api.post('/auth/forgot-password/verify-otp/resend', data);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password OTP resend error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de l'envoie du code de vérification");
        }
    },

    forgotPasswordReset: async (data: ResetPasswordPayload): Promise<VerifyResponse> => {
        try {
            const response = await resetPasswordApi.post('/auth/forgot-password/reset', data);
            return response.data;
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.response?.data?.message || "Echec lors de réinitialisation du mot de passe");
        }
    },

    getProfile: async (): Promise<UserProfile> => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error: any) {
            console.error('Profile retrieval error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer votre profil");
        }
    },

    getAuthenticatedUserOrganisation: async (): Promise<ActiveOrganisation[]> => {
        try {
            const response = await api.get<ActiveOrganisation[]>(`/auth/me/organisations`)
            return response.data
        } catch (error: any) {
            console.error('User organisations retrieval error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer vos organisations");
        }
    }
};
