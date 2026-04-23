import React, { useEffect, useState } from 'react'

type Props = {
  src: string
  language?: string
  height?: number
}

function withBasePath(path: string) {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/ArchitectureWG' : ''
  return `${basePath}${path}`
}

export default function FileTextPreview({
  src,
  language = 'text',
  height = 900
}: Props) {
  const [content, setContent] = useState('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const resolvedSrc = withBasePath(src)

    fetch(resolvedSrc)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${resolvedSrc}: ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setContent(text)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [src])

  if (error) {
    return (
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: '#fff7ed'
        }}
      >
        <strong>Preview unavailable</strong>
        <div style={{ marginTop: '8px' }}>{error}</div>
        <div style={{ marginTop: '8px' }}>
          <a href={withBasePath(src)} target="_blank" rel="noreferrer">
            Open source file
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'auto',
        maxHeight: `${height}px`,
        background: '#0b1020'
      }}
    >
      <pre style={{ margin: 0, padding: '16px' }}>
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  )
}
