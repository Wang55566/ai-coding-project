// lib/types.ts
export interface Task {
  id: string
  user_id: string
  title: string
  content: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  content?: string
  tags?: string[]
}

export interface UpdateTaskData {
  title?: string
  content?: string
  tags?: string[]
}
