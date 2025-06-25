export interface createPayload {
    parent_id: string;
    company_name: string;
    company_phone_number: string;
}

export interface updatePayload {
    organisationId: string;
    company_name: string;
    company_phone_number: string;
}

export interface deletePayload {
    organisationId: string;
}

export interface updateStatusPayload {
    organisationId: string;
    status: string;
}

export interface CreditSubOrganisationPayload {
    sub_organisation_id: string;
    amount: number;
}

export interface DebitSubOrganisationPayload {
    sub_organisation_id: string;
    amount: number;
}

export interface Wallet {
    status: string;
    collect: number;
    transfer: number;
    balance: number;
    commission: number;
    airtimeCommission: number;
}

export interface QrCode {
    code: string;
    status: string;
    url: string;
}

export interface AirtimeQrCode extends QrCode {
    code: string;
    status: string;
    url: string;
}

export interface AirtimeQrCodeCreated extends AirtimeQrCode {
    id: number,
    organisationId: string,
    createdAt: string,
    updatedAt: string
}

export interface Organisation {
    id: number;
    name: string;
    organisationId: string;
    userId: string;
    accountType: string;
    phone: string;
    status: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
    wallet: Wallet;
    qr_code: QrCode;
    isPasswordEnabled: boolean
}

export interface ActiveOrganisation {
    organisation_id: string;
    account_type: string;
    name: string;
    organisation_type: string;
    created_at: string; // Date en format ISO 8601 (UTC)
    updated_at: string; // Date en format ISO 8601 (UTC)
    user: {
        user_role: string;
        user_id: string;
    };
    wallet: Wallet | null; // Peut être nul si non défini
    qr_code: QrCode | null; // Peut être nul si non défini
    airtime_qrcode: AirtimeQrCode | null
}