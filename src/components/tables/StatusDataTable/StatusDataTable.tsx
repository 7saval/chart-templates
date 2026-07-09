import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { StatusDataTableProps } from "./StatusDataTable.types";
import { STATUS_COLORS, type StatusLevel } from "@/tokens/colors";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StatusDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
}: StatusDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<T>();

  const tableColumns = columns.map((col) =>
    columnHelper.accessor((row) => row[col.key], {
      id: String(col.key),
      header: col.header,
      enableSorting: col.sortable ?? false,
      cell: (info) => {
        const value = info.getValue();
        const row = info.row.original;
        const status = col.statusKey
          ? (row[col.statusKey] as StatusLevel | undefined)
          : undefined;
        const content = col.render ? col.render(value, row) : String(value);
        return (
          <span style={status ? { color: STATUS_COLORS[status] } : undefined}>
            {content}
          </span>
        );
      },
    }),
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={
                  header.column.getCanSort() ? "cursor-pointer select-none" : ""
                }
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {{ asc: " 🔼", desc: " 🔽" }[
                  header.column.getIsSorted() as string
                ] ?? ""}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
