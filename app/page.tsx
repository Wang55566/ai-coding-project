'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div className="loading-container">載入中...</div>
  
  if (!user) {
    return <div className="loading-container">重定向到登入頁面...</div>
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="card">
          <h1 className="page-title">儀表板</h1>
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
