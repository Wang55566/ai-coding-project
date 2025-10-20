'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Task, CreateTaskData, UpdateTaskData } from '@/lib/types'
import AITaskGenerator from './AITaskGenerator'
import AIContentSuggestion from './AIContentSuggestion'
import TagInput from './TagInput'
import TagBadge from './TagBadge'

export default function TaskList() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState<CreateTaskData>({ title: '', content: '', tags: [] })
  const [editTask, setEditTask] = useState<UpdateTaskData>({ title: '', content: '', tags: [] })
  const [searchQuery, setSearchQuery] = useState('')

  // 搜尋過濾邏輯
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks
    
    const lowerQuery = searchQuery.toLowerCase()
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.content?.toLowerCase().includes(lowerQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }, [tasks, searchQuery])

  // 載入任務列表
  const fetchTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('載入任務失敗:', error)
        return
      }

      setTasks(data || [])
    } catch (error) {
      console.error('載入任務失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  // 新增任務
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newTask.title.trim()) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: newTask.title.trim(),
          content: newTask.content?.trim() || null,
          tags: newTask.tags || []
        })
        .select()

      if (error) {
        console.error('新增任務失敗:', error)
        return
      }

      if (data && data[0]) {
        setTasks([data[0], ...tasks])
        setNewTask({ title: '', content: '', tags: [] })
        setIsAdding(false)
      }
    } catch (error) {
      console.error('新增任務失敗:', error)
    }
  }

  // 更新任務
  const updateTask = async (id: string) => {
    if (!editTask.title?.trim()) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: editTask.title.trim(),
          content: editTask.content?.trim() || null,
          tags: editTask.tags || []
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('更新任務失敗:', error)
        return
      }

      if (data && data[0]) {
        setTasks(tasks.map(task => task.id === id ? data[0] : task))
        setEditingId(null)
        setEditTask({ title: '', content: '', tags: [] })
      }
    } catch (error) {
      console.error('更新任務失敗:', error)
    }
  }

  // 刪除任務
  const deleteTask = async (id: string) => {
    if (!confirm('確定要刪除這個任務嗎？')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('刪除任務失敗:', error)
        return
      }

      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('刪除任務失敗:', error)
    }
  }

  // 開始編輯
  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTask({ title: task.title, content: task.content || '', tags: task.tags || [] })
  }

  // 取消編輯
  const cancelEdit = () => {
    setEditingId(null)
    setEditTask({ title: '', content: '', tags: [] })
  }

  // AI 生成任務回調
  const handleAIGenerated = (title: string, content: string) => {
    setNewTask({ title, content, tags: [] })
    setIsAdding(true)
  }

  // 搜尋功能
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // 清除搜尋
  const clearSearch = () => {
    setSearchQuery('')
  }

  // 點擊標籤搜尋
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
  }

  // 載入任務
  useEffect(() => {
    fetchTasks()
  }, [user])

  if (loading) {
    return <div className="loading-container">載入任務中...</div>
  }

  return (
    <div className="task-container">
      <div className="task-header">
        <h1 className="page-title">我的任務</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary"
        >
          新增任務
        </button>
      </div>

      {/* 搜尋欄 */}
      <div className="search-container">
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜尋任務標題、內容或標籤..."
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="search-clear"
              title="清除搜尋"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 新增任務表單 */}
      {isAdding && (
        <div className="task-form">
          <form onSubmit={addTask}>
            <div className="form-group">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="任務標題"
                required
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <textarea
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                placeholder="任務內容（選填）"
                className="form-textarea"
                rows={4}
              />
              <AIContentSuggestion
                content={newTask.content || ''}
                onSuggestionApplied={(suggestion) => setNewTask({ ...newTask, content: suggestion })}
              />
            </div>
            <div className="form-group">
              <TagInput
                tags={newTask.tags || []}
                onTagsChange={(tags) => setNewTask({ ...newTask, tags })}
                placeholder="添加標籤（按 Enter 或逗號分隔）"
                maxTags={10}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                新增
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewTask({ title: '', content: '', tags: [] })
                }}
                className="btn btn-secondary"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 任務列表 */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchQuery 
                ? `沒有找到包含「${searchQuery}」的任務` 
                : '還沒有任務，點擊「新增任務」開始吧！'
              }
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              {editingId === task.id ? (
                // 編輯模式
                <div className="task-edit">
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                    className="form-input"
                    autoFocus
                  />
                  <textarea
                    value={editTask.content}
                    onChange={(e) => setEditTask({ ...editTask, content: e.target.value })}
                    className="form-textarea"
                    rows={3}
                  />
                  <AIContentSuggestion
                    content={editTask.content || ''}
                    onSuggestionApplied={(suggestion) => setEditTask({ ...editTask, content: suggestion })}
                  />
                  <TagInput
                    tags={editTask.tags || []}
                    onTagsChange={(tags) => setEditTask({ ...editTask, tags })}
                    placeholder="修改標籤..."
                    maxTags={10}
                  />
                  <div className="task-actions">
                    <button
                      onClick={() => updateTask(task.id)}
                      className="btn btn-primary btn-sm"
                    >
                      儲存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-secondary btn-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                // 顯示模式
                <>
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    {task.content && (
                      <p className="task-description">{task.content}</p>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="task-tags">
                        {task.tags.map((tag, index) => (
                          <TagBadge
                            key={`${tag}-${index}`}
                            tag={tag}
                            onClick={() => handleTagClick(tag)}
                          />
                        ))}
                      </div>
                    )}
                    <div className="task-meta">
                      <span className="task-date">
                        建立於 {new Date(task.created_at).toLocaleDateString()}
                      </span>
                      {task.updated_at !== task.created_at && (
                        <span className="task-date">
                          更新於 {new Date(task.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => startEdit(task)}
                      className="btn btn-secondary btn-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="btn btn-danger btn-sm"
                    >
                      刪除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI 任務生成器 */}
      <AITaskGenerator onTaskGenerated={handleAIGenerated} />
    </div>
  )
}
