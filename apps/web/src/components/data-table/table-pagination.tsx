"use client";

import { Pagination } from "@heroui/react";

const WINDOW = 5;

const visiblePages = (page: number, pageCount: number) => {
  const start = Math.max(1, Math.min(page - Math.floor(WINDOW / 2), pageCount - WINDOW + 1));
  return Array.from({ length: Math.min(WINDOW, pageCount) }, (_, index) => start + index);
};

type TablePaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const TablePagination = ({ page, pageCount, total, onPageChange }: TablePaginationProps) => (
  <Pagination className="w-full justify-between">
    <Pagination.Summary>{total} total</Pagination.Summary>
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.Previous isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>
          <Pagination.PreviousIcon />
        </Pagination.Previous>
      </Pagination.Item>
      {visiblePages(page, pageCount).map((number) => (
        <Pagination.Item key={number}>
          <Pagination.Link isActive={number === page} onPress={() => onPageChange(number)}>
            {number}
          </Pagination.Link>
        </Pagination.Item>
      ))}
      <Pagination.Item>
        <Pagination.Next isDisabled={page >= pageCount} onPress={() => onPageChange(page + 1)}>
          <Pagination.NextIcon />
        </Pagination.Next>
      </Pagination.Item>
    </Pagination.Content>
  </Pagination>
);
