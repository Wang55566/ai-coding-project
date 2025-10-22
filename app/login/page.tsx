'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // 如果用戶已登入，重定向到首頁
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // 如果正在檢查認證狀態，顯示載入中
  if (authLoading) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="loading-message">載入中...</div>
        </div>
      </div>
    )
  }

  // 如果用戶已登入，不渲染登入表單
  if (user) {
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: 'a12349743@gmail.com',
      password: 'password'
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2 className="auth-title">
            登入
          </h2>
          <p className="auth-subtitle">
            請輸入您的帳號資訊
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}
          
          <div className="auth-form-group">
            <label className="auth-form-label">郵箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的郵箱"
              required
              className="auth-form-input"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-form-label">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入您的密碼"
              required
              className="auth-form-input"
            />
          </div>

          <div className="auth-form-actions">
            <button
              type="submit"
              disabled={loading}
              className={`auth-form-submit ${loading ? 'loading' : ''}`}
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </div>

          <div className="auth-divider">
            <span>或</span>
          </div>

          <div className="auth-form-demo">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="auth-form-demo-btn"
            >
              🎭 使用 Demo 帳號登入
            </button>
          </div>

          <div className="auth-form-links">
            <span className="auth-text">
              還沒有帳號？{' '}
              <Link href="/signup" className="auth-form-link">
                立即註冊
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
