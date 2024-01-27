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
    allowsAnon: string;
    isReceiptEnabled: string;
}

export interface Organization {
    id: number;
    name: string;
    logo: string;
    country?: string;
    allowsAnon?: string;
    nonprofitTaxID?: string;
    areNotesEnabled?: boolean;
    isReceiptEnabled?: string;
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