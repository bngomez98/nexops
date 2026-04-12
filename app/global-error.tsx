'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '6rem 1.5rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: '#3d7a4f',
            }}
          >
            500
          </p>
          <h1
            style={{
              marginTop: '1rem',
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              marginTop: '1rem',
              maxWidth: '42rem',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              color: '#6b7280',
            }}
          >
            An unexpected error occurred. If the problem persists, please contact
            support at{' '}
            <a
              href="mailto:admin@nexusoperations.org"
              style={{ color: '#3d7a4f', textDecoration: 'underline' }}
            >
              admin@nexusoperations.org
            </a>
            .
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '9999px',
                backgroundColor: '#3d7a4f',
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '9999px',
                border: '1px solid #e5e7eb',
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#111827',
                textDecoration: 'none',
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
