import { IPaytype } from "../../../purchase/data/models/purhase.model";
import { IUnit } from "../../../stock/data/model/stock";

export interface IProductFormDtoWrapper {
  form: IProduct;
  payTypeList: IPaytype[];
  unitList: IUnit[];
  supplierList: IProductSupplier[];
}

export interface IProduct {
  productId: number;
  name: string;
  path: string;
  hasActive: boolean;
}

export interface IProductSupplier {
  supplierId: number;
  name: string;
  mobile1: string;
  mobile2: string;
  businessName: string;
  pan: string;
  location: string;
  email: string;
}


