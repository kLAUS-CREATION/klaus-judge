"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Trophy, Settings } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    const actions = [
        {
            title: "New Problem",
            icon: Plus,
            href: "/admin/problems/create",
            color: "text-blue-500",
        },
        {
            title: "Add User",
            icon: UserPlus,
            href: "/admin/users",
            color: "text-green-500",
        },
        {
            title: "New Contest",
            icon: Trophy,
            href: "/admin/contests/create",
            color: "text-purple-500",
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/admin/settings",
            color: "text-gray-500",
        },
    ];

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                {actions.map((action) => (
                    <Button
                        key={action.title}
                        variant="outline"
                        className="w-full justify-start gap-2"
                        asChild
                    >
                        <Link href={action.href}>
                            <action.icon className={`h-4 w-4 ${action.color}`} />
                            {action.title}
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}
