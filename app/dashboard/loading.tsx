export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center px-6 py-24">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  )
}
