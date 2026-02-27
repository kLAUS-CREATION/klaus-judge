"use client";

import { useSubmission } from "@/lib/hooks/use-submissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  MemoryStick, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Code,
  TestTube,
  Loader2
} from "lucide-react";

interface SubmissionDetailProps {
  submissionId: string;
}

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
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse';
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
      return <Loader2 className="w-4 h-4 animate-spin" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export default function SubmissionDetail({ submissionId }: SubmissionDetailProps) {
  const { data: submission, isLoading, error } = useSubmission(submissionId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Failed to load submission details</p>
          <Button asChild className="mt-4">
            <Link href="/home/submissions">Back to Submissions</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isProcessing = ['QUEUED', 'JUDGING'].includes(submission.verdict.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/home/submissions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Submission Details</h1>
          <p className="text-muted-foreground">
            Submitted {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge className={`${getVerdictColor(submission.verdict)} text-base px-3 py-1`}>
              <div className="flex items-center gap-2">
                {getVerdictIcon(submission.verdict)}
                {submission.verdict}
              </div>
            </Badge>
            {isProcessing && (
              <span className="text-sm text-muted-foreground">
                Processing your submission...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Execution Time</p>
                <p className="font-semibold">
                  {submission.execution_time > 0 ? `${submission.execution_time}ms` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MemoryStick className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Memory Used</p>
                <p className="font-semibold">
                  {submission.memory_used > 0 ? `${submission.memory_used} KB` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TestTube className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Test Cases</p>
                <p className="font-semibold">
                  {submission.tests_passed > 0 || submission.tests_failed > 0 
                    ? `${submission.tests_passed}/${submission.tests_passed + submission.tests_failed} passed`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="code" className="space-y-4">
        <TabsList>
          <TabsTrigger value="code">
            <Code className="w-4 h-4 mr-2" />
            Code
          </TabsTrigger>
          <TabsTrigger value="results">
            <TestTube className="w-4 h-4 mr-2" />
            Test Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Submitted Code</span>
                <Badge variant="outline">{submission.language}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border">
                <pre className="p-4 text-sm">
                  <code>{submission.code}</code>
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Case Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Running test cases... This may take a few moments.
                  </p>
                </div>
              ) : submission.test_results && submission.test_results.length > 0 ? (
                <div className="space-y-4">
                  {submission.test_results.map((result, index) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Test Case {index + 1}</h4>
                        <Badge className={getVerdictColor(result.verdict)}>
                          <div className="flex items-center gap-1">
                            {getVerdictIcon(result.verdict)}
                            {result.verdict}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Execution Time</p>
                          <p>{result.execution_time}ms</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Memory Used</p>
                          <p>{result.memory_used} KB</p>
                        </div>
                      </div>

                      {result.output && (
                        <div className="mt-3">
                          <p className="text-muted-foreground text-sm mb-2">Output</p>
                          <ScrollArea className="h-24 w-full rounded border bg-muted/50">
                            <pre className="p-2 text-xs">
                              <code>{result.output}</code>
                            </pre>
                          </ScrollArea>
                        </div>
                      )}

                      {result.error_message && (
                        <div className="mt-3">
                          <p className="text-muted-foreground text-sm mb-2">Error</p>
                          <ScrollArea className="h-24 w-full rounded border bg-red-50 dark:bg-red-900/20">
                            <pre className="p-2 text-xs text-red-600 dark:text-red-400">
                              <code>{result.error_message}</code>
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No test results available yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}