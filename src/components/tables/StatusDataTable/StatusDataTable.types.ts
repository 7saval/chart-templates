export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  statusKey?: keyof T;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface StatusDataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
}
