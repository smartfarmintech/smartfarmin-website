"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.log("[v0] Global error:", error.message)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f7f0",
          color: "#1f2d22",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              height: "56px",
              width: "56px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              backgroundColor: "#3d6b3f",
              color: "#ffffff",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            R
          </div>
          <h1 style={{ marginTop: "24px", fontSize: "24px", fontWeight: 600 }}>
            A critical error occurred
          </h1>
          <p
            style={{
              marginTop: "8px",
              lineHeight: 1.6,
              color: "#5a6b5c",
              fontSize: "15px",
            }}
          >
            AgreeConnect ran into an unexpected problem. Please reload the application to
            continue.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "28px",
              cursor: "pointer",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#3d6b3f",
              color: "#ffffff",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Reload AgreeConnect
          </button>
        </div>
      </body>
    </html>
  )
}
