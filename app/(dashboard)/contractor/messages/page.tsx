"use client"

import { useState } from "react"
import { Search, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockConversations = [
  {
    id: "1",
    homeowner: "John D.",
    avatar: "JD",
    project: "Kitchen faucet replacement",
    lastMessage: "Yes, that works perfectly. See you then!",
    timestamp: "2 hours ago",
    unread: false,
  },
  {
    id: "2",
    homeowner: "Sarah M.",
    avatar: "SM",
    project: "Water heater installation",
    lastMessage: "Great, I've confirmed the appointment for Wednesday.",
    timestamp: "1 day ago",
    unread: false,
  },
  {
    id: "3",
    homeowner: "Michael T.",
    avatar: "MT",
    project: "Bathroom pipe leak",
    lastMessage: "Hi, I'm interested in getting a quote for this job.",
    timestamp: "3 hours ago",
    unread: true,
  },
]

const mockMessages = [
  {
    id: "1",
    sender: "user",
    text: "Hi Mike! Thanks for reaching out about my faucet issue.",
    timestamp: "Yesterday, 2:00 PM",
  },
  {
    id: "2",
    sender: "contractor",
    text: "Hi John! I've reviewed your project request for the kitchen faucet replacement.",
    timestamp: "Yesterday, 3:15 PM",
  },
  {
    id: "3",
    sender: "contractor",
    text: "Based on the photos you provided, this looks like a straightforward job. I can replace it with a similar model for around $180 including parts and labor.",
    timestamp: "Yesterday, 3:16 PM",
  },
  {
    id: "4",
    sender: "user",
    text: "That sounds reasonable. When would you be available?",
    timestamp: "Yesterday, 4:30 PM",
  },
  {
    id: "5",
    sender: "contractor",
    text: "I can come by tomorrow (Tuesday) afternoon around 2 PM. Does that work for you?",
    timestamp: "Yesterday, 5:00 PM",
  },
  {
    id: "6",
    sender: "user",
    text: "Yes, that works perfectly. See you then!",
    timestamp: "2 hours ago",
  },
]

export default function ContractorMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with homeowners</p>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card">
        {/* Conversations list */}
        <div className="w-full max-w-xs border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10 h-9" />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-secondary/50",
                  selectedConversation.id === conv.id && "bg-secondary"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-medium text-primary">{conv.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">{conv.homeowner}</span>
                    {conv.unread && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.project}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">{selectedConversation.avatar}</span>
            </div>
            <div>
              <h3 className="font-medium">{selectedConversation.homeowner}</h3>
              <p className="text-sm text-muted-foreground">{selectedConversation.project}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "contractor" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-xl px-4 py-2",
                    msg.sender === "contractor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    msg.sender === "contractor" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setMessage("")
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
