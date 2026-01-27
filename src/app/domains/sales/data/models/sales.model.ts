// Replace ./path/to/IInventoryMaster1Dto with the actual path to the file containing the IInventoryMaster1Dto interface.

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
}
export type DiscountField = 'disPercent' | 'disAmount';

// export interface ISalesFormDtoWrapper {
//   form: ISalesFormDto;
//   payTypeList: IAccTreeShortDto[];
//   inventoryList: IInventoryDetailDto[];
//   patientList: IPatient2Dto[];
// }

// export interface ISalesFormDto {
//   transactionMaster: ISalesTransactionMaster1Dto;
//   inventoryList: IInventoryDetailDto[];
//   payTypeList: IAccTreeShortDto[];
// }

// export interface ISalesTransaction1Dto {
//   masterId: number;
//   salesId: number;
//   refId: number;
//   refType: string;
//   payType: string;
//   saveDate: string;
//   billNo: string;
//   amount: number;
//   disAmount: number;
//   customerName: string;
//   customerAddress: string;
// }

// export interface IInventoryDetailDto {
//   inventoryId: number;
//   unitId: number;
//   qty: number;
//   purchaseRate: number;
//   salesRate: number;
//   medicineId: number;
//   medicine: string;
//   expiryDate: string;
//   saveDate: string;
//   batch: string;
// }

// export interface ISalesTransactionMaster1Dto {
//   masterId: number;
//   refType: string;
//   payTypeId: number;
//   payType: string;
//   billNo: string;
//   saveDate: string;
//   customerId: number;
//   totalAmount: number;
//   remarks: string;
// }

// export interface IPatient2Dto {
//   patientId: number;
//   name: string;
//   address: string;
//   mobile1: string;
//   mobile2: string;
//   dobBs: string;
//   dobAd: string;
//   gender: string;
// }

// export interface IAccTreeShortDto {
//   id: number;
//   parentId: number;
//   name: string;
//   type: string;
// }
// // sales return section

// export interface ISalesReturnFormDtoWrapper {
//   form: ISalesReturnFormDto;
//   inventoryList: IInventoryDetailDto[];
//   payTypeList: IPaytype[];
//   conditionList: string[];
// }

// export interface ISalesReturnFormDto {
//   transactionMaster: ISalesReturnTransactionMasterFormDto;
//   inventoryList: IInventoryDetailDto[];
// }
// export interface ISalesReturnTransactionMasterFormDto {
//   masterId: number;
//   payTypeId: number;
//   payType: string;
//   billNo: string;
//   saveDate: string;
//   condition: string;
//   customerId: number;
//   totalAmount: number;
//   remarks: string;
// }
