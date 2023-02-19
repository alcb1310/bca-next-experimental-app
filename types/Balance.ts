export type Balance = {
    supplier: {
        uuid: string;
        name: string;
        supplier_id: string;
    } | null;
    uuid: string;
    date: Date;
    invoice_number: string;
    total: number;
};
