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