import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentSubmissions } from "@/components/admin/recent-submissions"
import { QuickActions } from "@/components/admin/quick-actions"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <h1 className="text-sm font-semibold text-muted-foreground italic"> Klaus Judge Platform </h1>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
              <p className="text-muted-foreground">Monitor and manage the judging system performance.</p>
            </div>
          </div>

          <DashboardStats />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 lg:items-start">
            <div className="lg:col-span-1 border-none shadow-none hidden lg:block" />
            <RecentSubmissions />
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              {/* We could add more here, like System Health or Notifications */}
              <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Main API</span>
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Worker Queue</span>
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Judge Node 01</span>
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
