export interface mobileMoneyWithdrawPayload {
    transaction_type: string;
    amount: string;
    provider: string;
    number: string;
    country: string;
    currency: string;
    otp: string;
    notify_success_url: string;
    notify_failure_url: string;
    qrcode: string;
}

export interface mobileMoneyWithdrawResponse {
    transaction_id: string;
    amount: string;
    currency: string;
    operation_type: string;
    payment_details: {
        phoneNumber: string;
        country: string;
        provider: string;
        otp: string;
    };
    status: string;
    action_type: string;
    reference: string;
    success_url: string;
    failure_url: string;
}

export interface waveWithdrawPayload {
    transaction_type: string;
    amount: string;
    provider: string;
    number: string;
    country: string;
    currency: string;
    success_url: string;
    error_url: string;
    notify_success_url: string;
    notify_failure_url: string;
    qrcode: string;
}

export interface waveWithdrawResponse {
    transaction_id: string;
    amount: string;
    currency: string;
    operation_type: string;
    payment_details: {
        phoneNumber: string;
        country: string;
        provider: string;
        success_url: string;
        error_url: string;
        wave_launch_url: string;
    };
    status: string;
    action_type: string;
    reference: string;
    success_url: string;
    failure_url: string;
}

export interface DepositPayload {
    operation_type: string;
    amount: string;
    provider: string;
    category: string;
    number: string;
    country: string;
    currency: string;
    organisation_id: string;
    transaction_token: string;
}

export interface Transaction {
    id: string;
    accountType: "main" | "kbine"
    transactionType: string;
    amount: string;
    currency: string;
    organisationId: string;
    paymentMethod: string;
    transactionSchoolDetails: {
        city: string
        class: string
        firstname: string
        lastname: string,
        matricule: string,
        classe: string,
        phoneNumber: string
        purpose: {
            libelle: string,
            code: string
        }
    } | null
    transactionFees: {
        feesId: string,
        amount: string,
        rate: string,
        currency: string
    },
    paymentDetails: {
        country_code: string;
        service: string;
        phone_number: string;
        provider: string;
        otp: string;
    };
    provider: string;
    country_code: string;
    phone_number: string;
    status: string;
    failureReason: string;
    category: CashoutTypeValue
    reference: string;
    transactionId: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Represents a summary of transaction details.
 * Includes the total payout amount, total withdrawal amount,
 * and an array of recent transactions.
 */
export interface TransactionSummary {
    payoutTotal: number,
    withdrawalTotal: number,
    recentTransactions: Transaction[]
}

/**
 * Interface representing a transaction analysis.
 * @interface
 */
export interface TransactionAnalyzeChart {
    date: string,
    payout: string
    withdrawal: string
}

export interface AirtimeTransaction {
    id: string;
    transactionType: string;
    accountType: "main" | "kbine";
    amount: string;
    category: string;
    currency: string;
    organisationId: string;
    paymentMethod: string;
    transactionId: string;
    userId: string;
    status: string;
    failureReason: string;
    reference: string;
    createdAt: string;
    updateAt: string;
    paymentDetails: {
        country_code: string;
        service: string;
        phone_number: string;
        provider: string;
        otp: string;
    };
    transactionDetails: {
        createdAt: string;
        updateAt: string;
        transactionId: number;
        details: string;
        id: string;
        meta: {}
        receiveDetails: {
            operator_id: number;
            error: string;
            country_code: string;
            phone_number: string;
            service: string;
            status: string;
        }
        senderDetails: {
            provider: number;
            country_code: string;
            phone_number: string;
            service: string;
            status: string;
            failed_reason: string;
            otp: string;
        }
    },
}

export interface TransactionFees {
    feesAmount: number,
    feesPercentage: number,
    finalAmount: number
}

export interface TransactionFeesRequestPayload {
    amount: number,
    payment_method: string,
    account_type: string,
    transaction_type: string
}

/**
 * Represents the possible values for a cashout type.
 * It can either be "revenue", "airtime_revenue", "revenue_commission", or "airtime_commission".
 */
export type CashoutTypeValue = "revenue" | "airtime_revenue" | "revenue_commission" | "airtime_commission"

/**
 * Represents the type of cashout.
 * @typedef {Object} CashoutType
 * @property {"revenue" | "airtime_revenue" | "revenue_commission" | "airtime_commission"} value - The value representing the cashout type.
 * @property {string} label - The label associated with the cashout type.
 */
export interface CashoutType {
    value: CashoutTypeValue,
    label: string,
}

/**
 * Represents the payload required for authenticating a payout request.
 *
 * This interface is used to define the structure of data when requesting
 * payout authentication, ensuring type safety and consistency.
 *
 * Properties:
 * - amount: The monetary value of the payout.
 * - password: The authentication password associated with the request.
 * - organisation_id: The unique identifier of the organization initiating the payout.
 */
export interface PayoutAuthenticationPayload {
    amount: string,
    password: string,
    number: string,
    organisation_id: string,
}