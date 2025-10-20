'use client'

// components/AuthForm.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async (e) => {
    e.preventDefault()
    
    if (isLogin) {
      // 登入
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) console.error('登入錯誤:', error)
    } else {
      // 註冊
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0], // 從郵箱生成用戶名
            full_name: ''
          }
        }
      })
      if (error) console.error('註冊錯誤:', error)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleAuth}>
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
          className="btn btn-primary"
        >
          {isLogin ? '登入' : '註冊'}
        </button>
      </div>

      <div className="auth-footer">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="btn btn-secondary"
        >
          {isLogin ? '沒有帳號？點擊註冊' : '已有帳號？點擊登入'}
        </button>
      </div>
    </form>
  )
}