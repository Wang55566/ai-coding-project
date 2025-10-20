'use client'

import { useState } from 'react'

interface AITaskGeneratorProps {
  onTaskGenerated: (title: string, content: string) => void
}

export default function AITaskGenerator({ onTaskGenerated }: AITaskGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('請輸入任務描述')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
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
        throw new Error(data.error || `生成任務失敗 (${response.status})`)
      }

      // 驗證回應格式
      if (!data.title || !data.content) {
        throw new Error('AI 生成的回應格式不正確')
      }

      // 生成成功，回調到父組件
      onTaskGenerated(data.title, data.content)
      
      // 重置狀態
      setPrompt('')
      setIsOpen(false)
      setError('')
    } catch (err) {
      console.error('生成任務錯誤:', err)
      setError(err instanceof Error ? err.message : '生成任務失敗，請稍後再試')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setPrompt('')
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate()
    }
  }

  return (
    <>
      {/* 浮動按鈕 */}
      <div className="ai-fab-container">
        <button
          onClick={() => setIsOpen(true)}
          className={`ai-fab ${isOpen ? 'ai-fab-open' : ''}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
              fill="currentColor"
            />
            <path
              d="M19 15L19.5 17L21 17.5L19.5 18L19 20L18.5 18L17 17.5L18.5 17L19 15Z"
              fill="currentColor"
            />
            <path
              d="M5 15L5.5 17L7 17.5L5.5 18L5 20L4.5 18L3 17.5L4.5 17L5 15Z"
              fill="currentColor"
            />
          </svg>
        </button>
        
        {/* Tooltip */}
        <div className="ai-tooltip">
          <span className="ai-tooltip-text">AI 生成任務</span>
          <div className="ai-tooltip-arrow"></div>
        </div>
      </div>

      {/* 對話框 */}
      {isOpen && (
        <div className="ai-dialog-overlay" onClick={handleClose}>
          <div className="ai-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ai-dialog-header">
              <h3 className="ai-dialog-title">AI 任務生成器</h3>
              <button
                onClick={handleClose}
                className="ai-dialog-close"
                title="關閉"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="ai-dialog-content">
              <div className="ai-input-group">
                <label htmlFor="ai-prompt" className="ai-input-label">
                  描述你想要創建的任務
                </label>
                <textarea
                  id="ai-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="例如：明天下午3點開會討論Q1銷售報告，需要準備簡報和數據分析"
                  className="ai-textarea"
                  rows={4}
                  disabled={isGenerating}
                />
                <div className="ai-input-hint">
                  按 Ctrl+Enter 快速生成
                </div>
              </div>

              {error && (
                <div className="ai-error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1L15 15H1L8 1Z" fill="currentColor"/>
                    <path d="M8 6V10M8 12H8.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="ai-dialog-actions">
                <button
                  onClick={handleClose}
                  className="btn btn-secondary"
                  disabled={isGenerating}
                >
                  取消
                </button>
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary ai-generate-btn"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <div className="ai-spinner"></div>
                      生成中...
                    </>
                  ) : (
                    '生成任務'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
