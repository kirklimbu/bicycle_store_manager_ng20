
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
    accountId?: number | null;
    productId?: number | null;
    fromDate: string;
    toDate: string;
}

export interface IStockLedgerReport {
    stockDetailId: number;
    saveDate: string;
    payType: string;
    name: string;
    billNo: string;
    txnType: string;
    drItem: number;
    crItem: number;
    balanceQty: number;
}