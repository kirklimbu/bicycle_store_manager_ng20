// Replace ./path/to/IInventoryMaster1Dto with the actual path to the file containing the IInventoryMaster1Dto interface.

import { IPaytype } from "../../../purchase/data/models/purhase.model";

export interface ISales {
  salesMasterId: number;
  customerId: number;
  billNo: string;
  saveDate: string;
  remarks: string;
  transType: string;
  selectedStockList: IStock[];
}
export interface IStock {
  stockMasterId: number;
  category: string;
  company: string;
  name: string;
  pricePerUnit: number;
  remaining: number;
  unit: string;
  path: string;
  qty: number;
}

export interface FilterValues {
  search?: string;
  selector?: {
    salesId: number;
    name: string;
  };
  fromDate?: string;
  toDate?: string;
  supplierId?: number;
  customerId?: number;
}
export type DiscountField = 'disPercent' | 'disAmount';

export interface ISalesReturnFormDtoWrapper {
  form: ISalesReturnFormDto;
  payTypeList: IPaytype[];
  stockList: IStockMasterDto[];
  salesMasterList: ISalesMasterShortDto[];
}
export interface IStockMasterDto {
  stockMasterId: number;
  name: string;
  unit: string;
  path: string;
  taxRate: number;
  pricePerUnit: number;
}
export interface ISalesMasterShortDto {
  salesMasterId: number;
  billNo: string;
}
export interface ISalesMasterDto {
  salesMasterId: number;
  customerId: number;

  billNo: string;
  saveDate: string;

  totalAmt: number;
  discountAmt: number;
  taxableAmt: number;
  taxAmt: number;
  netAmt: number;

  payType: string;
}



export interface ISalesReturnFormDto {
  salesReturnMaster: ISalesReturnMasterDto;
  selectedStockList: ISalesReturnStockDto[];
}
export interface ISalesReturnMasterDto {
  salesRetMasterId: number;
  customerId: number;
  salesMasterId: number;
  saveDate: string;
  remarks: string;
  payTypeId: number;
  customerName: string;
  mobile: string;
}
export interface ISalesReturnStockDto {
  salesDetailId: number;
  salesMasterId: number;
  customerId: number;

  stockMasterId: number;
  name: string;

  qty: number;
  unitId: number;
  pricePerUnit: number;

  totalAmt: number;
  discountAmt: number;
  taxableAmt: number;
  taxAmt: number;
  netAmt: number;

  taxRate: number;
}



