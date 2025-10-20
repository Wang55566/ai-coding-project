'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import TagBadge from './TagBadge'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export default function TagInput({ 
  tags, 
  onTagsChange, 
  placeholder = '輸入標籤，按 Enter 或逗號分隔',
  maxTags = 10,
  className = ''
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    
    if (!trimmedTag) return
    
    // 檢查標籤長度
    if (trimmedTag.length > 20) {
      alert('標籤長度不能超過20個字元')
      return
    }
    
    // 檢查標籤數量
    if (tags.length >= maxTags) {
      alert(`最多只能添加${maxTags}個標籤`)
      return
    }
    
    // 檢查重複
    if (tags.includes(trimmedTag)) {
      return
    }
    
    onTagsChange([...tags, trimmedTag])
    setInputValue('')
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 如果輸入框為空且按退格鍵，刪除最後一個標籤
      removeTag(tags[tags.length - 1])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 如果包含逗號，自動添加標籤
    if (value.includes(',')) {
      const parts = value.split(',')
      const tagToAdd = parts[0].trim()
      if (tagToAdd) {
        addTag(tagToAdd)
      }
      setInputValue(parts.slice(1).join(',').trim())
    } else {
      setInputValue(value)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const tagsToAdd = pastedText.split(/[,\n]/).map(tag => tag.trim()).filter(tag => tag)
    
    tagsToAdd.forEach(tag => {
      if (tags.length < maxTags && !tags.includes(tag)) {
        onTagsChange([...tags, tag])
      }
    })
  }

  return (
    <div className={`tag-input-container ${className}`}>
      <div className="tag-input-wrapper">
        <div className="tag-list">
          {tags.map((tag, index) => (
            <TagBadge
              key={`${tag}-${index}`}
              tag={tag}
              onRemove={() => removeTag(tag)}
              isEditable={true}
            />
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="tag-input-field"
          disabled={tags.length >= maxTags}
        />
      </div>
      {tags.length > 0 && (
        <div className="tag-input-hint">
          已添加 {tags.length}/{maxTags} 個標籤
        </div>
      )}
    </div>
  )
}
