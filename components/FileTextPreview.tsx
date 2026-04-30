'use client'

import React, { useEffect, useMemo, useState } from 'react'

type Props = {
  src: string
  language?: 'json' | 'xml' | 'ttl' | 'text'
  height?: number
}

function withBasePath(path: string) {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/ArchitectureWG' : ''

  return `${basePath}${path}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function highlightJson(value: string) {
  return escapeHtml(value).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g,
    (match, stringValue, colon, keyword) => {
      if (stringValue && colon) {
        return `<span class="token-key">${stringValue}</span>${colon}`
      }

      if (stringValue) {
        return `<span class="token-string">${stringValue}</span>`
      }

      if (keyword) {
        return `<span class="token-keyword">${keyword}</span>`
      }

      return `<span class="token-number">${match}</span>`
    }
  )
}

function highlightXml(value: string) {
  return escapeHtml(value)
    .replace(/(&lt;\/?)([\w:-]+)/g, '$1<span class="token-key">$2</span>')
    .replace(/([\w:-]+)=("[^"]*")/g, '<span class="token-attr">$1</span>=<span class="token-string">$2</span>')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>')
}

function highlightTtl(value: string) {
  return escapeHtml(value)
    .replace(/(#.*)$/gm, '<span class="token-comment">$1</span>')
    .replace(/(&lt;[^&]*?&gt;)/g, '<span class="token-url">$1</span>')
    .replace(/("[^"]*")/g, '<span class="token-string">$1</span>')
    .replace(/\b(a|prefix|PREFIX|base|BASE)\b/g, '<span class="token-keyword">$1</span>')
}

function highlight(value: string, language: Props['language']) {
  if (language === 'json') return highlightJson(value)
  if (language === 'xml') return highlightXml(value)
  if (language === 'ttl') return highlightTtl(value)
  return escapeHtml(value)
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
        if (!cancelled) {
          setContent(text)
        }
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

  const highlightedContent = useMemo(
    () => highlight(content, language),
    [content, language]
  )

  if (error) {
    return (
      <div className="file-preview-error">
        <strong>Preview unavailable</strong>
        <div>{error}</div>
        <a href={withBasePath(src)} target="_blank" rel="noreferrer">
          Open source file
        </a>
      </div>
    )
  }

  return (
    <>
      <div className="file-preview">
        <pre>
          <code
            dangerouslySetInnerHTML={{
              __html: highlightedContent
            }}
          />
        </pre>
      </div>

      <style jsx>{`
        .file-preview {
          border: 1px solid #334155;
          border-radius: 8px;
          overflow: auto;
          max-height: ${height}px;
          background: #0f172a;
        }

        pre {
          margin: 0;
          padding: 16px;
          color: #e2e8f0;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre;
        }

        code {
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            'Liberation Mono', 'Courier New', monospace;
        }

        :global(.token-key) {
          color: #93c5fd;
        }

        :global(.token-string) {
          color: #86efac;
        }

        :global(.token-number) {
          color: #fcd34d;
        }

        :global(.token-keyword) {
          color: #c4b5fd;
        }

        :global(.token-comment) {
          color: #94a3b8;
          font-style: italic;
        }

        :global(.token-attr) {
          color: #f9a8d4;
        }

        :global(.token-url) {
          color: #67e8f9;
        }

        .file-preview-error {
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 16px;
          background: #fff7ed;
        }
      `}</style>
    </>
  )
}
