export interface createUserPayload {
    organisation_id: string;
    fullname: string;
    phone: string;
    country_id: string;
    role: string;
    password: string;
}

export interface confirmUserPayload {
    otp: string;
    phone_number: string;
    country_id: string;
}
export interface updateUserPayload {
    organisation_id: string;
    fullname: string;
    phone: string;
    email: string;
    countryCode: string;
}
export interface createUserResponse {
    organisation_id: string;
    organisation: {};
    name: string;
    fullname: string;
    phone: string;
    email: string;
    countryCode: string;
    role: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface updateUserResponse {
    id: string;
    userUuid: string;
    fullname: string;
    meta:{
        
    };
    phone: string;
    countryCode: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface userOrganisation {
    organisationId: string;
    name: string;
    meta: {
        pivot_user_id: string;
        pivot_organisation_id: string;
        pivot_role: string;
    };
    accountType: string;
    wallet: {
        transfer:string;
        collect:string;
        balance:string;
    };
    qrCode: {
        code: string;
    };
    createdAt: string;
    updatedAt: string;

}
export interface User{
    organisation_id: string;
    organisation: {};
    name: string;
    fullname: string;
    phone: string;
    email: string;
    countryCode: string;
    role: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}