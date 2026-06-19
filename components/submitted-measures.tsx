"use client"

import { useState, useCallback, useRef } from "react"

interface UploadedPDF {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: Date
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function SubmittedMeasures() {
  const [files, setFiles] = useState<UploadedPDF[]>([])
  const [dragging, setDragging] = useState(false)
  const [viewing, setViewing] = useState<UploadedPDF | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const pdfs = Array.from(incoming).filter(f => f.type === "application/pdf")
    const newItems: UploadedPDF[] = pdfs.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
      uploadedAt: new Date(),
    }))
    setFiles(prev => [...prev, ...newItems])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ""
  }, [addFiles])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const f = prev.find(x => x.id === id)
      if (f) URL.revokeObjectURL(f.url)
      return prev.filter(x => x.id !== id)
    })
    if (viewing?.id === id) setViewing(null)
  }, [viewing])

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto", fontFamily: "var(--font-sans, system-ui)" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px, 2.8vw, 26px)",
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "-0.018em",
          marginBottom: 6,
        }}>
          Submitted Measures
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-muted, #666)", margin: 0 }}>
          Upload PDFs of measures submitted to you. Files are stored in this browser session only.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#688E93" : "#ccc"}`,
          borderRadius: 12,
          padding: "40px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#688E9308" : "transparent",
          transition: "border-color 0.15s, background 0.15s",
          marginBottom: 32,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
        <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", margin: "0 0 4px" }}>
          Drop PDFs here, or click to browse
        </p>
        <p style={{ fontSize: 12, color: "var(--ink-muted, #888)", margin: 0 }}>
          Select multiple files at once · PDF only
        </p>
      </div>

      {/* File viewer */}
      {viewing && (
        <div style={{
          marginBottom: 32,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{viewing.name}</span>
            <button
              onClick={() => setViewing(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                color: "#666",
                lineHeight: 1,
                padding: "2px 4px",
              }}
              aria-label="Close viewer"
            >
              ×
            </button>
          </div>
          <iframe
            src={viewing.url}
            title={viewing.name}
            style={{ width: "100%", height: 600, border: "none", display: "block" }}
          />
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div>
          <p style={{ fontSize: 12, color: "var(--ink-muted, #888)", marginBottom: 12 }}>
            {files.length} file{files.length !== 1 ? "s" : ""} uploaded
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {files.map(f => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  background: viewing?.id === f.id ? "#f0f7f8" : "#fff",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 2px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {f.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--ink-muted, #888)" }}>
                    {formatBytes(f.size)} · {formatDate(f.uploadedAt)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setViewing(v => v?.id === f.id ? null : f)}
                    style={{
                      fontSize: 12,
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "1px solid #688E93",
                      background: viewing?.id === f.id ? "#688E93" : "transparent",
                      color: viewing?.id === f.id ? "#fff" : "#688E93",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    {viewing?.id === f.id ? "Hide" : "View"}
                  </button>
                  <a
                    href={f.url}
                    download={f.name}
                    style={{
                      fontSize: 12,
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                      background: "transparent",
                      color: "#555",
                      cursor: "pointer",
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    Download
                  </a>
                  <button
                    onClick={() => removeFile(f.id)}
                    style={{
                      fontSize: 12,
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "1px solid #fecaca",
                      background: "transparent",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-muted, #aaa)" }}>
          No measures uploaded yet.
        </p>
      )}
    </div>
  )
}
