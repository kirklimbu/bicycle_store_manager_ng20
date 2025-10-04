import { ICompany } from './../../../company/data/model/company.model';
import { ICategory } from './../../../home/data/model/home.model';
export interface IStock {
  stockMasterId: number;
  name: string;
  costPerUnit: number;
  categoryId: number;
  companyId: number;
  hasActive: true;
  minNotification: number;
  unitId: number;
  mrp: number;
  remaining: number;
  sellPerUnit: number;
  marginPercent: number;
  sellPerUnit2: number;
  pricePerUnit: number;
  pricePerUnit2: number;
  marginPercent2: number;
  marginQty2: number;
  marginRemarks: string;
  file: string;
  unit: string;
  doc?: string;
  path?: string;
}

export interface IStockFormDtoWrapper {
  form: IStock;
  categoryList: ICategory[];
  companyList: ICompany[];
  unitList: IUnit[];
}

export interface IUnit {
  unitId: number;
  name: string;
  hasActive: true;
}
export interface IStockDetailFormDto {
  stockMasterId: number;
  costPerUnit: number;
  saveDate: string;
  qty: number;
  remarks: string;
}

export interface IStockDetailDto {
  stockDetailId: number;
  stockMasterId: number;
  costPerUnit: number;
  sellPerUnit: number;
  drItem: number;
  crItem: number;
  saveDate: string;
  remarks: string;
  unitId: number;
  unitName: string;
}
