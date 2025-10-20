import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: '請提供有效的任務內容' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: '任務內容過長，請控制在500字以內' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key 未設定' },
        { status: 500 }
      )
    }
    
    const result = await improveContentWithOpenAI(content)
    return NextResponse.json(result)

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API 金鑰無效' },
          { status: 500 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API 使用額度已用完' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: '內容改善失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

async function improveContentWithOpenAI(content: string) {
  const { default: OpenAI } = await import('openai')
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // 根據內容長度決定處理方式
  const contentLength = content.trim().length
  let systemPrompt = ''
  
  if (contentLength > 100) {
    // 長內容：提供摘要
    systemPrompt = '你是一個任務管理助手。請將以下任務內容整理成簡潔的摘要，保留重要資訊但去除冗餘部分。請直接返回摘要內容，不要額外說明。'
  } else {
    // 短內容：提供改善建議
    systemPrompt = '你是一個任務管理助手。請優化以下任務內容，讓它更清晰、結構化。改善文字表達、增加重點、如果需要可以分點列出。請直接返回改善後的內容，不要額外說明。'
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: content.trim()
      }
    ],
    temperature: 0.7,
    max_tokens: 300,
  })

  const response = completion.choices[0]?.message?.content

  if (!response) {
    throw new Error('OpenAI API 沒有返回內容')
  }

  return {
    improvedContent: response.trim(),
    type: contentLength > 100 ? 'summary' : 'improvement'
  }
}
