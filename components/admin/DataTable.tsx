"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedIds?: string[];
  onSelectIds?: (ids: string[]) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedIds,
  onSelectIds,
  sortKey,
  sortDirection,
  onSort,
  isLoading,
  emptyState,
  pagination,
  className,
}: DataTableProps<T>) {
  const isSelectable = Boolean(onSelectIds && selectedIds);

  const allSelected =
    data.length > 0 &&
    selectedIds !== undefined &&
    data.every((row) => selectedIds.includes(keyExtractor(row)));

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectIds) return;
    if (checked) {
      const allRowIds = Array.from(
        new Set([...(selectedIds || []), ...data.map((r) => keyExtractor(r))])
      );
      onSelectIds(allRowIds);
    } else {
      const pageIds = new Set(data.map((r) => keyExtractor(r)));
      onSelectIds((selectedIds || []).filter((id) => !pageIds.has(id)));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectIds || !selectedIds) return;
    if (selectedIds.includes(id)) {
      onSelectIds(selectedIds.filter((item) => item !== id));
    } else {
      onSelectIds([...selectedIds, id]);
    }
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface", className)}>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-outline-variant/60 bg-surface-container-low text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {isSelectable && (
                <th scope="col" className="w-12 px-4 py-3.5 text-center">
                  <span className="sr-only">Select all</span>
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-3.5 select-none",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.sortable && "cursor-pointer hover:text-on-surface",
                      col.className
                    )}
                    onClick={() => col.sortable && onSort?.(col.key)}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "right" && "justify-end",
                        col.align === "center" && "justify-center"
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-on-surface-variant/70">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse bg-surface">
                  {isSelectable && <td className="p-4" />}
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-4">
                      <div className="h-4 rounded-full bg-surface-variant/70 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (isSelectable ? 1 : 0)}
                  className="p-8 text-center text-on-surface-variant"
                >
                  {emptyState || "No records found."}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds?.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors duration-150",
                      onRowClick && "cursor-pointer hover:bg-surface-container-low/80",
                      isSelected && "bg-primary-container/20"
                    )}
                  >
                    {isSelectable && (
                      <td
                        className="w-12 px-4 py-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleToggleRow(id, e as unknown as React.MouseEvent)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-on-surface",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(row)
                          : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/60 bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">
          <div>
            Showing{" "}
            <span className="font-semibold text-on-surface">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-on-surface">
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-on-surface">
              {pagination.totalItems}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-full border border-outline-variant/60 px-3 py-1.5 font-medium hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-full border border-outline-variant/60 px-3 py-1.5 font-medium hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
