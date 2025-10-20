import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('API Route 被調用')
  
  try {
    const { prompt } = await request.json()

    // 驗證輸入
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '請提供有效的任務描述' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: '任務描述過長，請控制在500字以內' },
        { status: 400 }
      )
    }

    // 檢查 OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key 未設定')
      return NextResponse.json(
        { error: 'OpenAI API key 未設定，請檢查環境變數設定' },
        { status: 500 }
      )
    }

    console.log('OpenAI API key 已設定，開始生成任務')
    
    // 使用 OpenAI API 生成任務
    const result = await generateTaskWithOpenAI(prompt)
    return NextResponse.json(result)

  } catch (error) {
    console.error('生成任務時發生錯誤:', error)
    
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
      { error: '生成任務失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

// 真實的 OpenAI 調用函數（當需要時可以啟用）
async function generateTaskWithOpenAI(prompt: string) {
  const { default: OpenAI } = await import('openai')
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: '你是一個任務管理助手。根據用戶的描述，生成一個清晰的任務標題和詳細內容。請以 JSON 格式回應，格式如下：{"title": "任務標題", "content": "任務詳細內容"}'
      },
      {
        role: 'user',
        content: prompt.trim()
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  })

  const response = completion.choices[0]?.message?.content

  if (!response) {
    throw new Error('OpenAI API 沒有返回內容')
  }

  try {
    const parsedResponse = JSON.parse(response)
    
    if (!parsedResponse.title || !parsedResponse.content) {
      throw new Error('AI 回應格式不正確')
    }

    return {
      title: parsedResponse.title.trim(),
      content: parsedResponse.content.trim()
    }
  } catch (parseError) {
    console.error('JSON 解析錯誤:', parseError)
    console.error('AI 回應:', response)
    
    const lines = response.split('\n').filter(line => line.trim())
    const title = lines[0]?.replace(/^[#-*\s]*/, '').trim() || '新任務'
    const content = lines.slice(1).join('\n').trim() || '請補充任務詳細內容'
    
    return {
      title,
      content
    }
  }
}