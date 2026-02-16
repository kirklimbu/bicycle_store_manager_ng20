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