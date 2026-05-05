import { useState, useEffect } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { PageTitle } from "@/common/components/PageTitle";
import { UserTable } from "../components/UserTable";
import { useUsers } from "../queries/useUsers";

export function UsersPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: true },
  ]);
  const [search, setSearch] = useState("");

  const sortBy = (sorting[0]?.id as "id" | "name") || "name";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy,
    sortOrder,
    search: search || undefined,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search]);

  return (
    <div className="p-6">
      <PageTitle title="Users" subtitle="Manage and browse all users" />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <UserTable
        data={data?.data ?? []}
        pageCount={data?.meta.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
      />
    </div>
  );
}
