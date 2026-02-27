"use client";

import { useAuth } from "@/lib/context/auth-context";
import { useMySubmissions } from "@/lib/hooks/use-submissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Trophy,
  Code2,
  Target,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SubmissionSummary } from "@/types/submissions";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: submissionsData } = useMySubmissions(1, 5);

  const recentSubmissions = submissionsData?.submissions || [];
  const totalSubmissions = submissionsData?.total || 0;
  const acceptedSubmissions = recentSubmissions.filter(
    (s: SubmissionSummary) => s.verdict === "ACCEPTED",
  ).length;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-purple-600/10 to-blue-600/10 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back,{" "}
          <span className="text-purple-600">{user?.full_name}</span>! 👋
        </h1>
        <p className="text-muted-foreground">
          Keep coding, keep learning, keep winning!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Problems Solved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">attempts made</p>
          </CardContent>
        </Card>

        {/* Acceptance Rate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalSubmissions > 0
                ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedSubmissions}/{totalSubmissions}
            </p>
          </CardContent>
        </Card>

        {/* Successful Submissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{acceptedSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              solutions passed
            </p>
          </CardContent>
        </Card>

        {/* Total Submissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">total attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Username</p>
              <p className="font-medium text-sm">{user?.username}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                {user?.role}
              </Badge>
              {user?.verified && (
                <Badge variant="outline" className="bg-green-50">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <div className="pt-2">
              <Link href="/home/profile">
                <Button variant="outline" className="w-full">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest coding attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No submissions yet. Start solving problems!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission: SubmissionSummary) => (
                  <Link
                    key={submission.id}
                    href={`/home/submissions/${submission.id}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {submission.problem_slug}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {submission.submitted_at}
                        </p>
                      </div>
                      <Badge
                        variant={
                          submission.verdict === "ACCEPTED"
                            ? "default"
                            : submission.verdict === "WRONG_ANSWER"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {submission.verdict === "ACCEPTED" && "✓"}
                        {submission.verdict === "WRONG_ANSWER" && "✗"}
                        {submission.verdict === "RUNTIME_ERROR" && "⚠"}
                        {submission.verdict === "TIME_LIMIT_EXCEEDED" && "⏱"}
                        {submission.verdict === "PENDING" && "⏳"}
                        {submission.verdict}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link href="/home/submissions">
                <Button variant="outline" className="w-full">
                  View All Submissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/home/problems">
              <Button variant="outline" className="w-full">
                Browse Problems
              </Button>
            </Link>
            <Link href="/home/submissions">
              <Button variant="outline" className="w-full">
                View History
              </Button>
            </Link>
            <Link href="/home/profile">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
