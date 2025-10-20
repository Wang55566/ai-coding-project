'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TaskList from '../components/TaskList'

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
        <TaskList />
      </div>
    </div>
  )
}
