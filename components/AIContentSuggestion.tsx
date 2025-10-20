'use client'

import { useState } from 'react'

interface AIContentSuggestionProps {
  content: string
  onSuggestionApplied: (suggestion: string) => void
}

export default function AIContentSuggestion({ content, onSuggestionApplied }: AIContentSuggestionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [suggestionType, setSuggestionType] = useState<'improvement' | 'summary'>('improvement')
  const [error, setError] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(false)

  const handleGetSuggestion = async () => {
    if (!content.trim()) {
      setError('請先輸入任務內容')
      return
    }

    setIsLoading(true)
    setError('')
    setSuggestion('')
    setSuggestionType('improvement')

    try {
      const response = await fetch('/api/improve-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      // 檢查回應是否為 JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('API 返回非 JSON 格式:', text)
        throw new Error('伺服器回應格式錯誤')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `內容改善失敗 (${response.status})`)
      }

      // 驗證回應格式
      if (!data.improvedContent) {
        throw new Error('AI 改善的回應格式不正確')
      }

      setSuggestion(data.improvedContent)
      setSuggestionType(data.type || 'improvement')
      setShowSuggestion(true)
    } catch (err) {
      console.error('內容改善錯誤:', err)
      setError(err instanceof Error ? err.message : '內容改善失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    onSuggestionApplied(suggestion)
    setShowSuggestion(false)
    setSuggestion('')
  }

  const handleCloseSuggestion = () => {
    setShowSuggestion(false)
    setSuggestion('')
    setSuggestionType('improvement')
    setError('')
  }

  return (
    <div className="ai-suggestion-container">
      <button
        onClick={handleGetSuggestion}
        disabled={isLoading || !content.trim()}
        className="ai-suggestion-button"
      >
        {isLoading ? (
          <>
            <div className="ai-spinner"></div>
            {content.trim().length > 100 ? '摘要中...' : '分析中...'}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z" fill="currentColor"/>
              <path d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z" fill="currentColor"/>
            </svg>
            {content.trim().length > 100 ? 'AI 摘要' : 'AI 建議'}
          </>
        )}
      </button>

      {error && (
        <div className="ai-suggestion-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1L15 15H1L8 1Z" fill="currentColor"/>
            <path d="M8 6V10M8 12H8.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {showSuggestion && suggestion && (
        <div className="ai-suggestion-result">
          <div className="ai-suggestion-header">
            <h4>{suggestionType === 'summary' ? 'AI 內容摘要' : 'AI 改善建議'}</h4>
            <button
              onClick={handleCloseSuggestion}
              className="ai-suggestion-close"
              title="關閉"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="ai-suggestion-content">
            {suggestion}
          </div>
          <div className="ai-suggestion-actions">
            <button
              onClick={handleCloseSuggestion}
              className="btn btn-secondary btn-sm"
            >
              關閉
            </button>
            <button
              onClick={handleApplySuggestion}
              className="btn btn-primary btn-sm"
            >
              {suggestionType === 'summary' ? '套用摘要' : '套用建議'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
