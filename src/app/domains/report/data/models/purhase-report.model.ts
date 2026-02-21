export interface IPurchaseReport {
  purchaseDetailId: number;
  supplierId: number;
  supplierName: string;
  saveDate: string | Date; // ISO string or Date object
  netAmt: number;
  qty: number;
  stockMasterId: number;
  stockName: string;
  payType: 'Cash' | 'Credit' | 'Online'; // Literal types for better UX validation
  unitId: number;
  unit: string;
}

export interface IPurchaseMasterReport {
  purchaseMasterId: number;
  supplierId: number;
  billNo: string;
  supplierBillNo: string;
  saveDate: string;         // Often handled as ISO strings in enterprise APIs
  supplierSaveDate: string;
  netAmt: number;
  payType: string;
  supplierName: string;
}
export interface IPurchaseDetailReport {
  purchaseDetailId: number;
  supplierId: number;
  supplierName: string;
  saveDate: string;         // Often handled as ISO strings in enterprise APIs
  netAmt: number;
  qty: number;
  stockMasterId: number;
  stockName: string;
  unitId: number;
  unit: string;
}

export interface ISalesDetailReport {
  salesMasterId: number;
  customerId: number;
  customerName: string;
  saveDate: string;         // Often handled as ISO strings in enterprise APIs
  netAmt: number;
  billNo: string;
}
export interface IClosingStockReport {
  stockMasterId: number;
  stockName: string;
  batch: string;
  closingQty: number;         // Often handled as ISO strings in enterprise APIs
  costPerUnit: number;
  totalAmt: number;
  unitId: number;
}

export interface IProfitLossReport {
  key: string;
  value: number;
  level: number; // 0 for Parent, 1 for Child
  isSummary: boolean;
}
export interface ISalesReportMonthWise {
  salesMonth: string;
  totalInvoice: number;
  totalAmt: number;
  taxAmt: number;
  netAmt: number;

}
export interface IPurchaseReportMonthWise {
  purchaseMonth: string;
  totalInvoice: number;
  totalAmt: number;
  taxAmt: number;
  netAmt: number;

}