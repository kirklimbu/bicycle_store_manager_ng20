export interface ISupplierFormDto {
  form: ISupplierFormDto;
  vatTypeList: string[];
}
export interface ISupplier1Dto {
  supplierId: number;
  name: string;
  email: string;
  mobile1: string;
  mobile2: string;
  balance?: number;
  hasActive: boolean;
  location: string;
  pan: string;
  businessName: string;
}
export interface ISupplierTransaction1Dto {
  masterId: number;
  refId: number;
  refType: string;
  payType: string;
  saveDate: string;
  supplierId: number;
  totalAmount: number;
  remarks: string;
}
export interface IPurchaseTransactionFormDtoWrapper {
  form: IPurchaseTransactionFormDto;
  supplierList: ISupplier[];
  payTypeList: IAccTreeShortDto[];
  transactionTypeList: string[];
  accountTypeList: IAccTreeShortDto[];
}

export interface IAccTreeShortDto {
  id: number;
  parentId: number;
  name: string;
  type: string;
}

export interface IPurchaseTransactionFormDto {
  masterId: number;
  payTypeId: number;
  refType: string;
  payType: string;
  saveDate: string;
  supplierId: number;
  totalAmount: number;
  remarks: string;
}

export interface ISupplier {
  supplierId: number;
  supplierName: string;
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

export interface IAccTreeShortDto {
  id: number;
  parentId: number;
  name: string;
  type: string;
}
