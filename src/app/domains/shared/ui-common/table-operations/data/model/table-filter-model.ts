export interface IFilter {
  fromDate?: string; // ISO string
  toDate?: string;
  id?: string | number;
  selector?: string;
  [key: string]: any; // extensible for future use
}

export type FilterFieldType = 'text' | 'date' | 'select' | 'number';

export interface FilterField {
  name: string; // e.g. 'status'
  label: string; // e.g. 'Status'
  type: FilterFieldType; // 'text' | 'date' | 'select'
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // only for select
  visible?: boolean;
}
