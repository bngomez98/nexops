import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your assigned contractors</p>
        </div>

        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No messages yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Messages will appear here once a contractor claims your request
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
