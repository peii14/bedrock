"use client";

/** Server driven table: TanStack Table owns columns and state, HeroUI renders it accessibly. */

import { type SortDescriptor, Spinner, Table } from "@heroui/react";
import { type ColumnDef, useTable } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { dataTableFeatures } from "./columns";
import { TablePagination } from "./table-pagination";

type Features = typeof dataTableFeatures;

export type TableQuery = { page: number; pageSize: number; sort: string; order: "asc" | "desc" };

type DataTableProps<T extends { id: string }> = {
  label: string;
  columns: ReadonlyArray<ColumnDef<Features, T, unknown>>;
  data: T[];
  total: number;
  query: TableQuery;
  onQueryChange: (patch: Partial<Record<keyof TableQuery, string | number>>) => void;
  isLoading?: boolean;
  empty?: ReactNode;
};

export const DataTable = <T extends { id: string }>({
  label,
  columns,
  data,
  total,
  query,
  onQueryChange,
  isLoading = false,
  empty = "Nothing here yet",
}: DataTableProps<T>) => {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    rowCount: total,
    manualPagination: true,
    manualSorting: true,
    getRowId: (row) => row.id,
    state: {
      pagination: { pageIndex: query.page - 1, pageSize: query.pageSize },
      sorting: [{ id: query.sort, desc: query.order === "desc" }],
    },
  });

  const sortDescriptor: SortDescriptor = {
    column: query.sort,
    direction: query.order === "asc" ? "ascending" : "descending",
  };
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  return (
    <Table
      aria-busy={isLoading}
      className={
        isLoading && data.length > 0 ? "opacity-60 transition-opacity" : "transition-opacity"
      }
    >
      <Table.ScrollContainer>
        <Table.Content
          aria-label={label}
          sortDescriptor={sortDescriptor}
          onSortChange={({ column, direction }) =>
            onQueryChange({
              sort: String(column),
              order: direction === "ascending" ? "asc" : "desc",
            })
          }
        >
          <Table.Header>
            {headers.map((header, index) => (
              <Table.Column
                key={header.id}
                id={header.id}
                isRowHeader={index === 0}
                allowsSorting={header.column.getCanSort()}
              >
                <table.FlexRender header={header} />
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (isLoading ? <Spinner /> : empty)}
            items={table.getRowModel().rows}
          >
            {(row) => (
              <Table.Row id={row.id}>
                {row.getAllCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </Table.Cell>
                ))}
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <TablePagination
          page={query.page}
          pageCount={Math.max(1, table.getPageCount())}
          total={total}
          onPageChange={(page) => onQueryChange({ page })}
        />
      </Table.Footer>
    </Table>
  );
};
