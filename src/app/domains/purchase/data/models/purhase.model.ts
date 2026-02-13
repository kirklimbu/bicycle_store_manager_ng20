export interface IPurchaseFormDtoWrapper {
  form: IPurchaseFormDto;
  payTypeList: IPaytype[];
  stockList: IInventoryMaster1Dto[];
  supplierList: ISupplier[];
}
export interface IPurchaseFormDto {
  transactionMaster: ITransactionMaster1Dto;
  stockList: IInventoryDetail1Dto[];
  selectedStockList?: IInventoryMaster1Dto[];

}

export interface IPurchaseTransaction1Dto {
  // purchaseId: number;
  // refId: number;
  // masterId: number;
  // refType: string;
  // payType: string;
  // saveDate: string;
  // supplierSaveDate: string;
  // billNo: string;
  // amount: number;
  // disAmount: number;
  // supplierName: string;
  // supplierAddress: string;

  purchaseDetailId: number;
  purchaseMasterId: number;
  supplierId: number;
  stockMasterId: number;
  totalAmt: number;
  discountAmt: number;
  taxableAmt: number;
  taxAmt: number;
  netAmt: number;
  qty: number;
  unitId: number;
}
export interface ITransactionMaster1Dto {
  masterId: number;
  payType: string;
  billNo: string;
  saveDate: string;
  supplierBillNo: string;
  supplierSaveDa: string;
  supplierId: number;
  patientId: number;
  totalAmount: number;
  remarks: string;
  maxDueDate: string;
}

export interface ISupplier {
  supplierId: number;
  name: string;
  type: string;
  mobile: string;
  phone: string;
  vatNo: string;
  vatType: string;
  address: string;
  email: string;
  creditLimit: number;
  creditDays: number;
  hasDelete: boolean;
  outStanding: number;
}

export interface IInventoryDetail1Dto {
  inventoryId: number;
  masterId: number;
  unitId: number;
  qty: number;
  rate: number;
  medicine: string;
  disPercent: number;
  disAmount: number;
  transAmount: number;
}

export interface IInventoryMaster1Dto {
  inventoryId: number;
  unitId: number;
  qty: number;
  purchaseRate: number;
  salesRate: number;
  medicineId: number;
  medicine: string;
  expiryDate: string;
  saveDate: string;
}
export interface IPaytype {
  id: number;
  parentId: number;
  name: string;
  type: string;
}
export interface PurchaseFormParams {
  purchaseMasterId: number;
  supplierId: number;
  purRetMasterId?: number;
}
