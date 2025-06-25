export interface rechargePayload {
  amount: number;
  organisation_id: string;
  transactionType: string;
  sender: {
    service: string;
    success_url: string;
    error_url: string;
    phone_number: string;
    country_code: string;
    provider: string;
    otp: string;
  };
  receiver: {
    operator_id: number;
    country_code: string;
    phone_number: string;
  }
  
}

export interface recharcheResponse {
  reference: string
  status: string
  transactionType: string
  organisationId: string
  amount: number
  currency: string
  category: string
  userId: string
  createdAt: string
  updatedAt: string
  id: number
  transactionDetails: TransactionDetails;
}

export interface Transaction {
  id: string;
  transactionType: string;
  amount: string;
  currency: string;
  organisationId: string;
  paymentMethod: string;
  transactionDetails: TransactionDetails;
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
  reference: string;
  transactionId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetails {
  senderDetails: {
    service: string
    status: string
    phone_number: string
    country_code: string
    provider: string
    success_url: string
    error_url: string
    wave_url_launch: string
  }
  receiveDetails: {
    operator_id: number
    country_code: string
    phone_number: string
    service: string
    status: string
  }
  transactionId: number
  id: string
  createdAt: string
  updatedAt: string
  meta: {}
}

export interface Countries {
  iso_name: string;
  name: string;
  flag: string;
  currency_code: string;
  calling_code: string[];
}

export interface Operators {
  id: number;
  operator_id: number;
  data: boolean;
  bundle: boolean;
  denomination_type: string;
  operator: string;
  min_amount: number;
  max_amount: number;
  logo_urls: [];
  country: {
    isonName: string;
    name: string;
  };
  fixed_amounts: [],
  fixed_amounts_description: {}
}