import { ICompany } from 'src/app/domains/company/data/model/company.model';

export interface IBannerDto {
  bannerId: number;
  title: string;
  path: string;
  hasActive: boolean;
}

export interface IServiceDto {
  serviceId: number;
  title: string;
  description: string;
  doc: string;
  hasActive: boolean;
}

export interface IHome1DtoWrapper {
  bannerList: IBannerDto[];
  serviceList: IServiceDto[];
  companyList: ICompany[];
  productList: any[];
  organization: IOrganization;
}
export interface IOrganization {
  orgId: number;
  name: string;
  address: string;
  latitude?: string;
  longitude?: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  email: string;
  bio: string;
  logo: string;
  ceoMsg: string;
  ceoFile: string;
  ceoName: string;
  branchManager: string;
}

export interface ICeo {
  ceoMsg: string;
  path: string;
}

// category

export interface ICategory {
  categoryId: number;
  name: string;
  path: string;
  hasActive: boolean;
}

export interface IProduct {
  stockMasterId: number;
  categoryId: number;
  companyId: number;
  category: string;
  company: string
  name: string;
  remaining: number;
  unit: string;
  path: string;
  hasActive: true;
  mrp: number;
  pricePerUnit: number;
  marginPercent: number;
  hasEnableMargin: true;
  pricePerUnit2: number;
  marginPercent2: number;
  hasEnableMargin2: true;
  marginRemarks: string;
  saving: number;
  netAmt: number;
  qty: number;
}
