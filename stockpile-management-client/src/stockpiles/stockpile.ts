export interface Stockpile {
    id: string;
    name: string;
    gtin: string;
    expiryDate: string;
    location: string;
    quantity: number;
    photo?: Blob;
    isSynced: boolean;
    updatedAt: string;
}