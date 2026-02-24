export interface IDayend2Dto {
  message: string;
  saveDate: string;
}
export interface IDayendDto {
  dayEndId: number;
  saveDate: string;
  hasDayEnd: boolean;
  hasMonthEnd: boolean;
  hasYearEnd: boolean;
}
export interface IFiscalDto {
  fiscalId: number;
  startDate: string;
  shortName: string;
  endDate: string;

}
export interface IFiscalDto {
  fiscalId: number;
  startDate: string;
  shortName: string;
  endDate: string;

}
export interface IAccTreeDto {
  id: number;
  parentId: string;
  name: string;
  lf: string;
}
