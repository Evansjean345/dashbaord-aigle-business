export interface Supply {
  id: number;
  paymentProviderReference: string;
  userId: string;
  organisationId: number;
  amount: number;
  status: string;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
  provisionType: string;
  paymentProvider: providersList;
  
}

// export interface SupplyPayload {
//   amount: number;
//   payment_provider: string;
//   type: string;
//   document: File;
//   organisation_id: string;
//   provision_type: string;
// }
export interface SupplyPayload extends FormData {}


export interface SupplyResponse {
  id: number;
  userId: string;
  organisationId: string;
  amount: number;
  paymentProviderReference: string;
  status: string;
  documentUrl: string;
  provisionType: string;
  CreatedAt: string;
  updatedAt: string;
}

export interface providerPayload{
  type:string;
}

export interface providersList {
  id: number;
  reference: string;
  label: string;
  type: number;
  number: number;
  createdAt: string;
  updatedAt: string;
}