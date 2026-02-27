"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code, FileText, Trophy, TrendingUp } from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: "1,234",
        icon: Users,
        description: "+12% from last month",
        trend: "up",
    },
    {
        title: "Problems",
        value: "456",
        icon: Code,
        description: "+5 new this week",
        trend: "up",
    },
    {
        title: "Submissions",
        value: "12,890",
        icon: FileText,
        description: "2.4k in last 24h",
        trend: "up",
    },
    {
        title: "Active Contests",
        value: "3",
        icon: Trophy,
        description: "2 starting soon",
        trend: "neutral",
    },
];

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
