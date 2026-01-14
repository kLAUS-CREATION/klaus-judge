import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentSubmissions } from "@/components/admin/recent-submissions"
import { QuickActions } from "@/components/admin/quick-actions"

export default function Page() {
  return (
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
  )
}
