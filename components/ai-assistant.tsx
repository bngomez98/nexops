'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Sparkles, X, Send, Loader2, ChevronDown, MessageSquare, RotateCcw } from 'lucide-react'

interface AIAssistantProps {
  role: 'homeowner' | 'contractor'
  context?: string
}

const HOMEOWNER_STARTERS = [
  'What should I do after a hailstorm?',
  'How often should HVAC filters be changed?',
  'How do I write a good project description?',
  'What maintenance should I do this spring?',
]

const CONTRACTOR_STARTERS = [
  'How should I price a residential roofing job?',
  'What questions should I ask before claiming a project?',
  'What are typical permit requirements in Topeka?',
  'How do I assess a project description for hidden scope?',
]

function getTextFromMessage(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('')
}

export function AIAssistant({ role, context }: AIAssistantProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages, role, context },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleStarter(prompt: string) {
    sendMessage({ text: prompt })
  }

  const starters = role === 'contractor' ? CONTRACTOR_STARTERS : HOMEOWNER_STARTERS
  const title = role === 'contractor' ? 'Contractor Advisor' : 'Property Advisor'
  const subtitle = role === 'contractor'
    ? 'Bid pricing, scope review, project fit'
    : 'Maintenance guidance, project planning'

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI Assistant"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-lg transition-all duration-200 font-semibold text-[13px] ${
          open
            ? 'bg-foreground text-background'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {open ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        {open ? 'Close' : 'AI Advisor'}
        {!open && messages.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-[380px] max-w-[calc(100vw-48px)] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
          style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{title}</p>
                <p className="text-[10.5px] text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-foreground leading-relaxed flex-1">
                    {role === 'homeowner'
                      ? "Hi — I'm your property advisor. I can help you plan maintenance, write project descriptions, understand estimates, and keep your home in good shape. What's on your mind?"
                      : "Hi — I'm your contractor advisor. I can help you evaluate projects, check if a budget is realistic, identify scope risks, and think through pricing. What do you need?"
                    }
                  </div>
                </div>

                <div>
                  <p className="text-[10.5px] text-muted-foreground font-semibold uppercase tracking-wide mb-2 px-1">Try asking</p>
                  <div className="space-y-1.5">
                    {starters.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStarter(s)}
                        className="w-full text-left text-[12px] text-foreground/80 px-3 py-2 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map(msg => {
                const text = getTextFromMessage(msg)
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mb-0.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      }`}
                    >
                      {text}
                    </div>
                  </div>
                )
              })
            )}

            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-3.5 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 resize-none px-3 py-2.5 text-[13px] rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition max-h-28 overflow-y-auto"
                style={{ lineHeight: '1.5' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              AI-generated — verify important details independently
            </p>
          </div>
        </div>
      )}
    </>
  )
}
