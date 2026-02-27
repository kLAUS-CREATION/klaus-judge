"use client";

import { useState } from "react";
import { useMySubmissions } from "@/lib/hooks/use-submissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Code, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const getVerdictColor = (verdict: string) => {
  switch (verdict.toUpperCase()) {
    case 'AC':
    case 'ACCEPTED':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'WA':
    case 'WRONG_ANSWER':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'TLE':
    case 'TIME_LIMIT_EXCEEDED':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'QUEUED':
    case 'JUDGING':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const getVerdictIcon = (verdict: string) => {
  switch (verdict.toUpperCase()) {
    case 'AC':
    case 'ACCEPTED':
      return <CheckCircle className="w-4 h-4" />;
    case 'WA':
    case 'WRONG_ANSWER':
      return <XCircle className="w-4 h-4" />;
    case 'TLE':
    case 'TIME_LIMIT_EXCEEDED':
      return <Clock className="w-4 h-4" />;
    case 'QUEUED':
    case 'JUDGING':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

export default function SubmissionsList() {
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { data, isLoading, error } = useMySubmissions(page, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Failed to load submissions</p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.submissions?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
          <p className="text-muted-foreground">
            Start solving problems to see your submissions here!
          </p>
          <Button asChild className="mt-4">
            <Link href="/home/problems">Browse Problems</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil((data.total || 0) / limit);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.submissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link 
                      href={`/home/problems/${submission.problem_slug}`}
                      className="font-semibold text-lg hover:text-primary transition-colors"
                    >
                      {submission.problem_slug}
                    </Link>
                    <Badge className={getVerdictColor(submission.verdict)}>
                      <div className="flex items-center gap-1">
                        {getVerdictIcon(submission.verdict)}
                        {submission.verdict}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submitted {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/home/submissions/${submission.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} submissions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}