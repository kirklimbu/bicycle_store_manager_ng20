import { ISupplier } from "./purhase.model";

export interface PurchaseTransactionFormDtoWrapper {
    form: IPurchaseTransactionFormDto;
    supplierList: ISupplier[];
    payTypeList: IAccTreeShortDto[];
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

export interface IAccTreeShortDto {
    id: number;
    parentId: number;
    name: string;
    type: string;
}




