"use client";

import { useProblems } from "@/lib/hooks/use-problems";
import { columns } from "./problems-columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProblemsAdminPage() {
  const { data, isLoading } = useProblems();

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
          <p className="text-muted-foreground">Manage your coding challenges and test cases.</p>
        </div>
        <Button asChild>
          <Link href="/home/admin/problems/create">
            <Plus className="mr-2 h-4 w-4" /> Create Problem
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">Loading problems...</div>
      ) : (
        <DataTable columns={columns} data={data?.results || []} />
      )}
    </div>
  );
}
