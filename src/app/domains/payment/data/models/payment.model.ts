import { IPaytype, ISupplier } from "../../../purchase/data/models/purhase.model";
import { IUnit } from "../../../stock/data/model/stock";

export interface IPaymentFormDtoWrapper {
  form: IPayment;
  supplier: ISupplier;
  payTypeList: IPaytype[];

}

export interface IPayment {
  transactionId: number;
  supplierId: number;
  payTypeId: number;
  transAmt: number;
  remarks: string;
}



