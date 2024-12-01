import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious onClick={() => table.previousPage()} />
      </PaginationItem>
      {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
        (page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => table.setPageIndex(page - 1)}
              isActive={
                table.getState().pagination.pageIndex === page - 1
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )
      )}
      <PaginationItem>
        <PaginationNext onClick={() => table.nextPage()} />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
}