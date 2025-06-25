export interface RegisterPayload {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    company_name: string;
    company_phone_number: string;
    account_type: string;
    country_id: number;
}

export interface LoginPayload {
    phone: string;
    country_id: string;
    password: string;
}

export interface VerifyPayload {
    phone_number: string;
    otp?: number;
    country_id: number;
}

export type SendOtpPayload = Exclude<VerifyPayload, "otp">

export interface VerifyResponse {
    message: string;
}

export interface ForgotPasswordPayload {
    phone_number: string;
    country_id: number;
}

export interface ResetPasswordPayload {
    phone_number: string;
    country_id: number;
    password: string;
}

export interface ResetPasswordResponse {
    message: string;
    token: string;
}

export interface User {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    country: {
        name: string;
        phone_code: string;
        iso_two: string;
        currency: string;
    };
    role: string;
}

export interface Organisation {
    id: number;
    organisation_id: string;
    name: string;
    phone_number: string;
    account_type: string;
}

export interface Wallet {
    id: string;
    balance: number;
    collect: string;
    transfer: string;
}

export interface QrCode {
    code: string;
    status: string;
    url: string;
}

export interface AirtimesQrcode {
    code: string;
    status: string;
    url: string;
}


export interface UserProfile {
    user: User;
    organisation: Organisation;
    wallet: Wallet;
    qr_code: QrCode;
    airtimes_qrcode: AirtimesQrcode;
}
