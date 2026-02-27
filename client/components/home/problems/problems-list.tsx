"use client";

import { useProblems } from "@/lib/hooks/use-problems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProblemsListComponent() {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const { data, isLoading, error } = useProblems(page, 20, difficulty);

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getAcceptanceRate = (accepted: number, total: number) => {
    if (total === 0) return "0%";
    return `${Math.round((accepted / total) * 100)}%`;
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-semibold">Failed to load problems</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Problems
          </h1>
          <p className="text-muted-foreground mt-1">
            Solve coding challenges and improve your skills
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {["easy", "medium", "hard"].map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDifficulty(difficulty === diff ? undefined : diff);
                setPage(1);
              }}
              className="capitalize"
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
              </Card>
            ))
          : data?.problems.map((problem) => (
              <Card
                key={problem.slug}
                className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/home/problems/${problem.slug}`}>
                        <CardTitle className="hover:text-primary transition-colors flex items-center gap-2">
                          {problem.title}
                          <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </Link>
                      <div className="flex gap-2 flex-wrap mt-3">
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                        {problem.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Accepted
                      </p>
                      <p className="text-lg font-bold">
                        {problem.accepted_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Submissions
                      </p>
                      <p className="text-lg font-bold">
                        {problem.submission_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Acceptance
                      </p>
                      <p className="text-lg font-bold">
                        {getAcceptanceRate(
                          problem.accepted_count,
                          problem.submission_count,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing page {page} of {Math.ceil(data.total / 20)}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(data.total / 20)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
