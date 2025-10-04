import { ICustomer } from 'src/app/domains/customer/data/services/model/customer.model';

export interface IOrder {
  customerName: string;
  orderId: number;
  qty: number;
  mrp: number;
  orderDate: string;
  status: string;
  businessName: string;
  orderMasterId: 0;
  stockMasterId: 0;
  stockName: string;
  unitId: 0;
  unitName: string;
  pricePerUnit: 0;
  customerId: 0;
  orderById: 0;
  orderByName: string;
}

export interface IOrderApproveFormDtoWrapper {
  customer: ICustomer;
  form: IOrderApproveFormDto;
  transTypeList: string[];
}

export interface IOrderApproveFormDto {
  transType: string;
  remarks: string;
  orderList: IOrder[];
}
