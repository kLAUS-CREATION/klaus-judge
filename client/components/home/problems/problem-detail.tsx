"use client";

import { useProblem } from "@/lib/hooks/use-problems";
import { useSubmitSolution } from "@/lib/hooks/use-submissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Play, Clock, MemoryStick } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface ProblemDetailProps {
  slug: string;
}

export default function ProblemDetail({ slug }: ProblemDetailProps) {
  const { data: problem, isLoading, error } = useProblem(slug);
  const { mutate: submitSolution, isPending } = useSubmitSolution();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

    submitSolution({
      slug,
      code,
      language,
    });
  };

  const languages = ["cpp", "python", "java", "javascript", "go", "rust"];

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-semibold">Failed to load problem</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Problem Details */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{problem?.title}</h1>
          <div className="flex gap-2 flex-wrap mt-3">
            <Badge variant="default">{problem?.difficulty}</Badge>
            {problem?.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                  <p className="font-semibold">{problem?.time_limit}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Memory Limit</p>
                  <p className="font-semibold">{problem?.memory_limit}MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>{problem?.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Test Cases */}
        {problem?.test_cases && problem.test_cases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Test Cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {problem.test_cases
                .filter((tc) => tc.is_sample)
                .map((testCase, idx) => (
                  <div
                    key={testCase.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <h4 className="font-semibold">Test Case {idx + 1}</h4>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Input:
                      </p>
                      <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Expected Output:
                      </p>
                      <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                        {testCase.expected_output}
                      </pre>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Code Editor */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-96">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {isPending ? "Submitting..." : "Submit Solution"}
        </Button>
      </div>
    </div>
  );
}
