'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">任務管理系統</h1>
            <div>載入中...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">任務管理系統</h1>
            {!user && (
              <p className="tagline">歡迎來到我們的平台</p>
            )}
          </div>
          <nav className="nav">
            {user ? (
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button onClick={handleSignOut} className="btn btn-secondary">
                  登出
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link href="/login" className="btn btn-primary">
                  請登入
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
