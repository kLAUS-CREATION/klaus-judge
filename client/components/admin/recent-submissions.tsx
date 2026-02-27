"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentSubmissions = [
    {
        id: "SUB-001",
        user: "john_doe",
        problem: "Two Sum",
        status: "Accepted",
        language: "C++",
        time: "2 mins ago",
    },
    {
        id: "SUB-002",
        user: "alice_w",
        problem: "Median of Two Sorted Arrays",
        status: "Wrong Answer",
        language: "Python",
        time: "5 mins ago",
    },
    {
        id: "SUB-003",
        user: "bob_smith",
        problem: "Two Sum",
        status: "Time Limit Exceeded",
        language: "Java",
        time: "12 mins ago",
    },
    {
        id: "SUB-004",
        user: "charlie_b",
        problem: "Longest Substring",
        status: "Accepted",
        language: "Go",
        time: "15 mins ago",
    },
    {
        id: "SUB-005",
        user: "diana_p",
        problem: "Reverse Integer",
        status: "Runtime Error",
        language: "Rust",
        time: "20 mins ago",
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Accepted":
            return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
        case "Wrong Answer":
            return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
        case "Time Limit Exceeded":
        case "Memory Limit Exceeded":
            return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
        default:
            return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
};

export function RecentSubmissions() {
    return (
        <Card className="col-span-full xl:col-span-4 shadow-sm">
            <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Problem</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                                <TableCell className="font-medium">{submission.user}</TableCell>
                                <TableCell>{submission.problem}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={getStatusColor(submission.status)}>
                                        {submission.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{submission.language}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {submission.time}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
