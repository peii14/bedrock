import {
  createColumnHelper,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const dataTableFeatures = tableFeatures({ rowPaginationFeature, rowSortingFeature });

export const columnHelper = <T extends RowData>() =>
  createColumnHelper<typeof dataTableFeatures, T>();
