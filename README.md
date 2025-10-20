# AI AI 任務筆記系統

一個基於 Next.js 15 和 Supabase 的現代化任務管理應用，具備 AI 自動生成任務、標籤管理、搜尋功能，並支援完整的 Docker 容器化部署。

## 🏗️ 專案架構

### 前端架構
```
app/                          # Next.js App Router
├── api/generate-task/        # AI 任務生成 API
├── login/                    # 登入頁面
├── signup/                   # 註冊頁面
├── page.tsx                  # 主頁（任務列表）
├── layout.tsx                # 根佈局
└── globals.css               # 全局樣式

components/                   # React 組件
├── Header.tsx                # 頁面頭部
├── TaskList.tsx              # 任務列表主組件
├── AITaskGenerator.tsx       # AI 任務生成器
├── TagInput.tsx              # 標籤輸入組件
├── TagBadge.tsx              # 標籤顯示組件
└── AuthForm.tsx              # 認證表單組件

contexts/                     # React Context
└── AuthContext.tsx           # 認證狀態管理

lib/                          # 工具庫
├── supabase.js               # Supabase 客戶端
└── types.ts                  # TypeScript 類型定義

styles/                       # 樣式文件
├── base.css                  # 基礎樣式
├── components/               # 組件樣式
├── layout/                   # 佈局樣式
└── pages/                    # 頁面樣式
```

### 後端架構
- **Next.js API Routes**: 處理 AI 任務生成請求
- **Supabase**: 提供認證、資料庫和即時功能
- **OpenAI API**: 整合 GPT-3.5 進行任務生成

### 資料庫設計
```sql
tasks 表結構：
├── id (uuid, PK)             # 任務 ID
├── user_id (uuid, FK)        # 用戶 ID
├── title (text)              # 任務標題
├── content (text)            # 任務內容
├── tags (text[])             # 標籤陣列
├── created_at (timestamp)    # 創建時間
└── updated_at (timestamp)    # 更新時間
```

## 🛠️ 使用技術

### 前端技術
- **Next.js 15.5.6** - React 全端框架，使用 App Router
- **React 19.1.0** - 用戶界面庫
- **TypeScript 5** - 類型安全的 JavaScript
- **CSS Modules** - 模組化樣式管理
- **Geist Font** - 現代化字體

### 後端技術
- **Next.js API Routes** - 服務端 API
- **Supabase 2.75.1** - 後端即服務 (BaaS)
- **PostgreSQL** - 關聯式資料庫
- **Row Level Security (RLS)** - 資料安全策略

### AI 整合
- **OpenAI GPT-3.5-turbo** - 自然語言處理
- **RESTful API** - AI 服務整合

### 開發工具
- **Turbopack** - 快速打包工具

### 容器化
- **Docker** - 容器化平台
- **Docker Compose** - 多容器編排
- **多階段構建** - 優化鏡像大小

## 🚀 部署方式

### 1. 本地開發部署

```bash
# 安裝依賴
npm install

# 設定環境變數
cp env.template .env.local
# 編輯 .env.local 填入你的 API 金鑰

# 啟動開發服務器
npm run dev
```

### 2. Docker 容器化部署

#### 開發環境
```bash
# 啟動開發環境（支援 hot reload）
npm run docker:dev

# 查看日誌
npm run docker:logs

# 停止容器
npm run docker:down
```

#### 生產環境
```bash
# 構建生產鏡像
npm run docker:build

# 啟動生產環境
npm run docker:prod

# 清理所有資源
npm run docker:clean
```

### 3. 雲端部署

#### Vercel 部署
1. 連接 GitHub 倉庫到 Vercel
2. 設定環境變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
3. 自動部署完成

#### Docker 雲端部署
```bash
# 構建並推送到 Docker Hub
docker build -t your-username/ai-task-manager .
docker push your-username/ai-task-manager

# 在雲端服務器運行
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  your-username/ai-task-manager
```

## 🤖 AI 工具輔助使用情境

### 1. 任務自動生成
**使用情境**：用戶輸入自然語言描述，AI 自動生成結構化任務
- **輸入範例**：「明天要準備客戶簡報」
- **AI 處理**：分析需求，生成標題和詳細內容
- **輸出結果**：
  ```json
  {
    "title": "準備客戶簡報",
    "content": "1. 整理客戶資料\n2. 製作簡報投影片\n3. 準備 Q&A 資料\n4. 測試簡報設備"
  }
  ```

### 2. 智能任務建議
**使用情境**：根據用戶輸入的關鍵詞，AI 提供相關的任務建議
- **技術實現**：使用 OpenAI GPT-3.5-turbo 模型
- **API 整合**：Next.js API Route 處理請求
- **錯誤處理**：完整的錯誤處理和用戶反饋

### 3. 自然語言處理
**使用情境**：將用戶的模糊描述轉換為具體可執行的任務
- **語言支援**：支援中文和英文輸入
- **上下文理解**：AI 理解任務的優先級和時效性
- **個性化建議**：根據任務類型提供相應的執行建議

## 📋 功能特色

- 🔐 **用戶認證** - 基於 Supabase 的安全認證系統
- 📝 **任務管理** - 完整的 CRUD 操作
- 🤖 **AI 生成** - OpenAI GPT-3.5 自動生成任務
- 🏷️ **標籤系統** - 多標籤支援和模糊搜尋
- 🔍 **智能搜尋** - 標題、內容、標籤全文搜尋
- 📱 **響應式設計** - 支援各種設備尺寸
- 🎨 **現代化 UI** - 美觀的漸層設計和動畫效果
- 🐳 **容器化** - 完整的 Docker 支援
- 🔒 **資料安全** - Row Level Security 保護用戶資料

## 🛠️ 環境設定

### 1. 安裝依賴
```bash
npm install
```

### 2. 環境變數設定
建立 `.env.local` 檔案：
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 3. Supabase 資料庫設定
在 Supabase Dashboard 的 SQL Editor 中執行：

```sql
-- 建立 tasks 資料表
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 建立索引
create index tasks_user_id_idx on tasks(user_id);
create index tasks_tags_idx on tasks using gin(tags);

-- 啟用 RLS
alter table tasks enable row level security;

-- RLS 政策
create policy "Users can view their own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks for delete using (auth.uid() = user_id);

-- 自動更新 updated_at 觸發器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute procedure update_updated_at_column();
```

## 🚀 快速開始

### 本地開發
```bash
npm run dev
```
打開 [http://localhost:3000](http://localhost:3000)

### Docker 開發
```bash
npm run docker:dev
```