
export interface ISalesAgingReport {
    billNo: string;
    saveDate: string; // ISO date string
    netAmt: number;
    days: number;
    upto30: number;
    upto60: number;
    upto90: number;
    greaterThan90: number;
    balance: number;
}
export interface IPurchaseAgingReport {
    billNo: string;
    supplierBillNo: string;
    saveDate: string;         // System entry date
    supplierSaveDate: string; // Date on the physical invoice
    netAmt: number;
    days: number;             // Age of the bill in days
    upto30: number;
    upto60: number;
    upto90: number;
    greaterThan90: number;
    balance: number;          // Remaining amount to pay
}