export interface IPurchaseFormDtoWrapper {
  form: IPurchaseFormDto;
  payTypeList: IPaytype[];
  stockList: IInventoryMaster1Dto[];
  supplierList: ISupplier[];
  billTypeList: BillType[];
}
export interface IPurchaseFormDto {
  purchaseMaster: IPurchaseMaster1Dto;
  stockList: IInventoryDetail1Dto[];
  selectedStockList?: IInventoryMaster1Dto[];

}

export interface IPurchaseMaster1Dto {
  purchaseMasterId: number;
  supplierId: number;
  payTypeId: number;
  billNo: string;
  saveDate: string;
  supplierBillNo: string;
  supplierSaveDate: string;
  totalAmount: number;
  remarks: string;
  billType: string;
}

export type BillType = 'GROSS_ONLY' | 'GROSS_AND_CC'; export
  // type BillType = 'GROSS_AMT_ONLY' | 'DISCOUNT_TO_CC';

  interface CalcInputs {
  qty: number;
  rate: number;
  ccAmt: number;
  freeQty: number;
  taxRate: number;      // Standard VAT rate
  freeTaxRate: number;  // Specific rate for Free/CC items
  tradeCommRate: number;
  disPercent: number;
  discountAmt: number;
  ccPercent: number;
  lastEdited: 'disPercent' | 'discountAmt' | 'ccPercent' | 'ccAmt' | null;
}

interface FullCalcResult {
  totalAmt: number;
  disPercent: number;
  disAmt: number;
  taxableAmt: number;
  taxAmt: number;
  freeTaxAmt: number;
  netAmt: number;
}

export const BillStrategy: Record<BillType, (i: CalcInputs) => FullCalcResult> = {
  'GROSS_ONLY': (i) => {
    console.log('gross');
    const totalAmt = i.qty * i.rate;
    const ccBasis = i.freeQty * i.rate; // Basis for CC interchangeable calc

    // Handle Interchangeable CC
    const { ccAmt, ccPercent } = calculateCC(ccBasis, i.ccPercent, i.ccAmt, i.lastEdited);
    console.log('trade com%', i.tradeCommRate);

    const tradeCommAmt = (totalAmt * i.tradeCommRate) / 100;
    console.log('trade com', tradeCommAmt);

    const baseForDis = totalAmt - tradeCommAmt;
    const { disAmt, disPercent } = calculateDiscount(baseForDis, i.disPercent, i.discountAmt, i.lastEdited);

    // taxableAmt = total - disAmt + ccAmt
    const taxableAmt = totalAmt - disAmt + ccAmt;
    const taxAmt = (taxableAmt * i.taxRate) / 100;
    const freeTaxAmt = (i.rate * i.freeQty * i.freeTaxRate) / 100;

    return { totalAmt, disPercent, disAmt, ccPercent, ccAmt, taxableAmt, taxAmt, freeTaxAmt, netAmt: taxableAmt + taxAmt + freeTaxAmt };
  },

  'GROSS_AND_CC': (i) => {
    console.log('cc');

    const ccBasis = i.freeQty * i.rate;
    const { ccAmt, ccPercent } = calculateCC(ccBasis, i.ccPercent, i.ccAmt, i.lastEdited);

    // total = (qty * rate) + ccAmt
    const totalAmt = (i.qty * i.rate) + ccAmt;

    const tradeCommAmt = (totalAmt * i.tradeCommRate) / 100;
    const baseForDis = totalAmt - tradeCommAmt;
    const { disAmt, disPercent } = calculateDiscount(baseForDis, i.disPercent, i.discountAmt, i.lastEdited);

    // taxableAmt = total - disAmt
    const taxableAmt = totalAmt - disAmt;
    const taxAmt = (taxableAmt * i.taxRate) / 100;

    return { totalAmt, disPercent, disAmt, ccPercent, ccAmt, taxableAmt, taxAmt, freeTaxAmt: 0, netAmt: taxableAmt + taxAmt };
  }
};
/**
 * Helper to handle the "Back-calculation" logic for Discounts.
 * It determines whether to calculate the Amount from the Percent, 
 * or the Percent from the Amount, based on which field the user last touched.
 */
function calculateDiscount(
  base: number,
  p: number,
  a: number,
  lastField: string | null
): { disAmt: number; disPercent: number } {
  let disAmt = a;
  let disPercent = p;

  // Case 1: User typed in the Percentage field
  if (lastField === 'disPercent') {
    disAmt = (base * p) / 100;
  }
  // Case 2: User typed in the Amount field
  else if (lastField === 'discountAmt') {
    disPercent = base > 0 ? (a / base) * 100 : 0;
  }

  return { disAmt, disPercent };
}

function calculateCC(basis: number, p: number, a: number, lastField: string | null) {
  let ccAmt = a;
  let ccPercent = p;

  if (lastField === 'ccPercent') {
    ccAmt = (basis * p) / 100;
  } else if (lastField === 'ccAmt') {
    ccPercent = basis > 0 ? (a / basis) * 100 : 0;
  }

  return { ccAmt, ccPercent };
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
