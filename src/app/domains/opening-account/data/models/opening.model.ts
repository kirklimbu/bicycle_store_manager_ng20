/**
 * Represents the main wrapper for the Opening Form API response
 */
export interface IOpeningFormDtoWrapper {
  form: IOpeningForm;
  stockList: IStockItem[];
}

/**
 * The specific form structure containing Master and Detail data
 */
export interface IOpeningForm {
  openingMaster: IOpeningMaster;
  selectedStockList: ISelectedStockItem[];
}

/**
 * Header information for the Opening Stock/Purchase
 */
export interface IOpeningMaster {
  purchaseMasterId: number;
  billNo: string;
  saveDate: string;
  remarks: string;
}

/**
 * Items already saved/selected in the current form
 */
export interface ISelectedStockItem {
  purchaseDetailId: number;
  purchaseMasterId: number;
  stockMasterId: number;
  totalAmt: number;
  qty: number;
  unitId: number;
  pricePerUnit: number;
  name: string;
  taxRate: number;
  // Note: Add optional fields if your UI calculations need them (e.g., netAmt)
  netAmt?: number;
  discountAmt?: number;
  disPercent?: number;
  taxableAmt?: number;
  taxAmt?: number;
}

/**
 * Raw stock items available for selection in the dropdown/search
 */
export interface IStockItem {
  stockMasterId: number;
  name: string;
  unit: string;
  path: string;
  taxRate: number;
  pricePerUnit: number;
}