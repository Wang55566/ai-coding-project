'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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

  // 如果用戶已登入，不渲染註冊表單
  if (user) {
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('密碼確認不一致')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密碼至少需要6個字符')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: email.split('@')[0],
          full_name: ''
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">
            註冊成功！
          </h2>
          <p className="success-message">
            請檢查您的郵箱並點擊確認連結來完成註冊。
          </p>
          <Link href="/login" className="auth-form-submit">
            前往登入
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2 className="auth-title">
            註冊
          </h2>
          <p className="auth-subtitle">
            創建您的新帳號
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSignup}>
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
              placeholder="請輸入密碼（至少6個字符）"
              required
              className="auth-form-input"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-form-label">確認密碼</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="請再次輸入密碼"
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
              {loading ? '註冊中...' : '註冊'}
            </button>
          </div>

          <div className="auth-form-links">
            <span className="auth-text">
              已有帳號？{' '}
              <Link href="/login" className="auth-form-link">
                立即登入
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
