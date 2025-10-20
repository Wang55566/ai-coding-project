'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
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
              {error}
            </div>
          )}
          
          <div className="form-fields">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="郵箱"
              required
              className="form-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
              required
              className="form-input"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </div>

          <div className="auth-footer">
            <p className="auth-text">
              還沒有帳號？{' '}
              <Link href="/signup" className="auth-link">
                立即註冊
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
