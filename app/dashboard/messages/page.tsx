import { MessageSquare, Info } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Communication thread with your assigned contractor for each active request.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            A message thread is created automatically when a contractor claims your request. All communication regarding scope, scheduling, and estimates takes place here. Phone and email contact is available after a consultation is confirmed.
          </p>
        </div>

        {/* Empty state */}
        <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold">No active message threads</h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
            Message threads will appear here once a contractor has claimed one of your submitted requests.
          </p>
        </div>
      </div>
    </div>
  )
}
