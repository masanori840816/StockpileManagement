export interface Stockpile {
    id: string;
    name: string;
    gtin: string;
    expiryDate: string;
    location: string;
    quantity: number;
    isSynced: boolean;
    updatedAt: string;
}