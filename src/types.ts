export type Listing = {
    title: string,
    link: string,
    id: string,
    image: string
}

export interface ShortOrganization {
    id: number;
    name: string;
    logo: string;
    slug: string;
    allowsAnon: boolean;
    isReceiptEnabled: boolean;
}

export interface Organization {
    id: number;
    slug?: string;
    name: string;
    logo: string;
    country?: string;
    allowsAnon?: boolean;
    nonprofitTaxID?: string;
    areNotesEnabled?: boolean;
    isReceiptEnabled?: boolean;
    createdAt?: string;
    state?: string;
    city?: string;
    postcode?: string;
    nonprofitAddress1?: string;
    nonprofitAddress2?: string;
    uuid?: string;
    areFiatDonationsEnabled?: boolean;
    areCryptoDonationsEnabled?: boolean;
    areStockDonationsEnabled?: boolean;
    areDafDonationsEnabled?: boolean;
    areTributesEnabled?: boolean | null;
    organizationType?: string;
}
  
export interface OrganizationData {
    organizations: Organization[];
}
  
export interface Message {
    data: { organizations: Organization[] };
    requestId: string;
}

export interface OrganizationsResponse {
    success: boolean;
    message: Message;
}

export interface DepositDetails {
    organizationId: number,
    isAnonymous: boolean,
    pledgeCurrency: 'SOL',
    pledgeAmount: string,
    receiptEmail?: string,
    firstName?: string,
    lastName?: string,
    addressLine1?: string,
    addressLine2?: string,
    country?: string,
    state?: string,
    city?: string,
    zipcode?: string
}