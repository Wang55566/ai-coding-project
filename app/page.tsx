'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('登出錯誤:', error)
    } else {
      router.push('/login')
    }
  }

  if (loading) return <div className="loading-container">載入中...</div>
  
  if (!user) {
    return <div className="loading-container">重定向到登入頁面...</div>
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <div className="page-header">
            <h1 className="page-title">儀表板</h1>
            <button onClick={handleLogout} className="btn btn-secondary">
              登出
            </button>
          </div>
          <div className="info-section">
            <p><span className="label">用戶 ID:</span> {user.id}</p>
            <p><span className="label">郵箱:</span> {user.email}</p>
            <p><span className="label">註冊時間:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
