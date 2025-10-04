import { ICustomer } from 'src/app/domains/customer/data/services/model/customer.model';
import { IProduct } from 'src/app/domains/home/data/model/home.model';

export interface ICart {
  stockMasterId: number;
  unitId: number;
  qty: number;
}

export interface ICheckOutFormDtoWrapper {
  form: {
    userId: number;
    customerId: number;
  };
  summary: ISummary;
  customerList: ICustomer[];
  stockList: IProduct[];
}

export interface ISummary {
  totalSaving: number;
  totalNetAmt: number;
  totalMrpAmt: number;
}

export interface ICartDeleteResponseDto {
  message: string;
  stockList: IProduct[];
}
export interface ICartCountDto {
 count:number
}
