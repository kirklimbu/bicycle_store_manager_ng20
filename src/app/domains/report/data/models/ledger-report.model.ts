
export interface IGeneralLedgerReport {
    saveDate: string;
    account: string;
    voucherId: number;
    tableName: string;
    drAmt: number;
    crAmt: number;
    balance: number;
    absBalance: number;
    balanceType: string;
}

export interface LedgerFilter {
    fiscalId: number | null;
    accountId: number | null;
    fromDate: string;
    toDate: string;
}