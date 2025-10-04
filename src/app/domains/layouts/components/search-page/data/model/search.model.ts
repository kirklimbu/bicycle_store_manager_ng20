export interface ISearchOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ISearchConfig {
  placeholder?: string;
  searchText?: string;
  disabled?: boolean;
  loading?: boolean;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  searchOptions?: ISearchOption[];
  selectedSearchOption?: string;
}
