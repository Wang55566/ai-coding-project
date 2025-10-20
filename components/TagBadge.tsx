'use client'

interface TagBadgeProps {
  tag: string
  onRemove?: () => void
  onClick?: () => void
  isEditable?: boolean
  className?: string
}

export default function TagBadge({ 
  tag, 
  onRemove, 
  onClick, 
  isEditable = false,
  className = '' 
}: TagBadgeProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <span 
      className={`tag-badge ${isEditable ? 'tag-badge-editable' : ''} ${className}`}
      onClick={handleClick}
    >
      <span className="tag-text">{tag}</span>
      {isEditable && onRemove && (
        <button
          type="button"
          className="tag-remove"
          onClick={handleRemove}
          title="移除標籤"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9.5 3.5L6.5 6.5L9.5 9.5L8.5 10.5L5.5 7.5L2.5 10.5L1.5 9.5L4.5 6.5L1.5 3.5L2.5 2.5L5.5 5.5L8.5 2.5L9.5 3.5Z" />
          </svg>
        </button>
      )}
    </span>
  )
}
