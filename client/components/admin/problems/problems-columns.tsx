"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProblemSummary } from "@/types/problems";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DeleteProblemDialog } from "./delete-problem";

export const columns: ColumnDef<ProblemSummary>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const diff = row.original.difficulty;
      const variants: Record<string, "outline" | "secondary" | "destructive" | "default"> = {
        EASY: "secondary",
        MEDIUM: "outline",
        HARD: "destructive",
      };
      return <Badge variant={variants[diff] || "default"}>{diff}</Badge>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px]">
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "accepted_count",
    header: "Stats (Acc/Sub)",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.accepted_count} / {row.original.submission_count}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const problem = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/problems/${problem.slug}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/home/admin/problems/edit/${problem.slug}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Problem
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteProblemDialog slug={problem.slug} title={problem.title} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
