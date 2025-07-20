import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import * as XLSX from "xlsx";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown, Download, Eye } from "lucide-react";

// Column Configuration Interface
export interface ColumnConfig<T> {
  field: keyof T;
  headerName: string;
  sortable?: boolean;
  renderCell?: (item: T) => React.ReactNode;
  width?: string;
  visible?: boolean;
}

export interface NodgeTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  showConfigMenu?: boolean;
  exportOptions?: {
    enabled?: boolean;
    fileName?: string;
    exportAllData?: boolean;
  };
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    totalCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
}

const NodgeTable = <T,>({
  data,
  columns: initialColumns,
  showConfigMenu = true,
  exportOptions = { enabled: true },
  pagination,
}: NodgeTableProps<T>) => {
  const pageSizeOptions = pagination?.pageSizeOptions || [5, 10, 20, 30, 40, 50, 100];
  const [sortedData, setSortedData] = useState(data);
  const [columns, setColumns] = useState(
    initialColumns.map((col) => ({
      ...col,
      visible: col.visible !== false,
    }))
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);

  // Update sortedData when data changes
  useEffect(() => {
    setSortedData(data);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data]);

  // Update current page when prop changes
  useEffect(() => {
    if (pagination?.currentPage) {
      setCurrentPage(pagination.currentPage);
    }
  }, [pagination?.currentPage]);

  // Update columns when initialColumns changes
  useEffect(() => {
    setColumns(
      initialColumns.map((col) => ({
        ...col,
        visible: col.visible !== false,
      }))
    );
  }, [initialColumns]);

  // Sorting Logic
  const handleSort = (field: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        if (aValue === bValue) return 0;
        return direction === "asc" ? (aValue ? -1 : 1) : aValue ? 1 : -1;
      }

      const aString = String(aValue);
      const bString = String(bValue);
      return direction === "asc" 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
    setSortedData(sorted);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (field: keyof T) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.field === field ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination?.onPageChange?.(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
    pagination?.onPageSizeChange?.(size);
  };

  // Calculate paginated data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalItems = pagination?.totalCount || sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Export to Excel
  const exportToExcel = () => {
    const visibleColumns = columns.filter((col) => col.visible);
    const dataToExport = exportOptions?.exportAllData ? sortedData : paginatedData;

    const exportData = dataToExport.map((item) => {
      const obj: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        if (col.field === undefined || col.field === "actions" || col.field === "Actions") return;
        
        const value = item[col.field];
        if (value === undefined || value === null) {
          obj[col.headerName] = "";
        } else if (Array.isArray(value)) {
          obj[col.headerName] = value.join(", ");
        } else if (typeof value === "object" && !(value instanceof Date)) {
          try {
            obj[col.headerName] = JSON.stringify(value);
          } catch {
            obj[col.headerName] = "[Object]";
          }
        } else if (value instanceof Date) {
          obj[col.headerName] = value.toLocaleString();
        } else {
          obj[col.headerName] = value;
        }
      });
      return obj;
    });

    if (exportData.length === 0) {
      const emptyObj: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        emptyObj[col.headerName] = "";
      });
      exportData.push(emptyObj);
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    if (worksheet["!ref"]) {
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let i = range.s.c; i <= range.e.c; i++) {
        const column = XLSX.utils.encode_col(i);
        worksheet[`!cols`] = worksheet[`!cols`] || [];
        worksheet[`!cols`][i] = { wch: 20 };
      }
    }

    XLSX.writeFile(
      workbook,
      `${exportOptions.fileName || "export"}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  };

  // Filter visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;
      
      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }
      
      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const paginationControls = (
    <div className="flex px-4 w-full py-2 border-t">
      <Pagination className="space-x-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              isActive={currentPage > 1}
            />
          </PaginationItem>

          {getPageNumbers().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              isActive={currentPage < totalPages}
            />
          </PaginationItem>
        </PaginationContent>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Pagination>
    </div>
  );

  return (
    <div className="rounded-md border">
      <div className="w-full h-auto bg-transparent flex justify-end items-center border-b">
        {exportOptions.enabled && (
          <Button variant="outline" className="px-3" onClick={exportToExcel}>
            <Download className="h-4 w-4" />
          </Button>
        )}
        {showConfigMenu && (
          <div className="flex justify-end p-2 border-b">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="px-3" variant="outline">
                  <Eye size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CardContent className="border-none shadow-none p-0 p-4">
                  <CardContent className="p-0 space-y-4">
                    <div className="space-y-2">
                      <div className="space-y-2">
                        {columns.map(
                          (col) =>
                            col.field !== "actions" && (
                              <div
                                key={col.field as string}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`col-${col.field as string}`}
                                  checked={col.visible}
                                  onCheckedChange={() =>
                                    toggleColumnVisibility(col.field)
                                  }
                                />
                                <Label
                                  htmlFor={`col-${col.field as string}`}
                                  className="text-sm"
                                >
                                  {col.headerName}
                                </Label>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CardContent>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableHead
                key={col.field as string}
                style={{ width: col.width || "auto" }}
                className={col.sortable ? "cursor-pointer" : ""}
                onClick={() => col.sortable && handleSort(col.field)}
              >
                <div className="w-auto h-auto flex justify-center items-center gap-2">
                  {col.headerName}
                  {col.sortable && sortConfig?.key === col.field && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <TableRow key={index}>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={`${index}-${col.field as string}`}
                    className="text-center"
                  >
                    {col.renderCell
                      ? col.renderCell(item)
                      : (item[col.field] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="h-24 text-center"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination?.enabled && totalPages > 1 && paginationControls}
    </div>
  );
};

export default NodgeTable;