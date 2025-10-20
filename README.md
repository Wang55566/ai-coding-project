# AI 任務管理系統

這是一個基於 Next.js 和 Supabase 的任務管理應用，具備 AI 自動生成任務功能。

## 功能特色

- 🔐 用戶認證（註冊/登入）
- 📝 任務管理（新增、編輯、刪除）
- 🤖 AI 自動生成任務（使用 OpenAI GPT-3.5）
- 📱 響應式設計
- 🎨 現代化 UI 設計

## 環境設定

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設定

建立 `.env.local` 檔案並加入以下變數：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 3. Supabase 資料庫設定

在 Supabase Dashboard 的 SQL Editor 中執行以下 SQL：

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

## 開始使用

### 本地開發

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker 開發環境

#### 前置需求

- Docker Desktop
- Docker Compose

#### 快速開始

1. **複製環境變數範例**：
```bash
cp env.template .env.local
```

2. **編輯環境變數**：
編輯 `.env.local` 檔案，填入你的 Supabase 和 OpenAI API 金鑰。

3. **啟動開發環境**：
```bash
npm run docker:dev
# 或
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

4. **訪問應用**：
打開 [http://localhost:3000](http://localhost:3000)

#### Docker 指令

```bash
# 開發環境
npm run docker:dev          # 啟動開發環境
npm run docker:down         # 停止容器
npm run docker:logs         # 查看日誌

# 生產環境
npm run docker:build        # 構建生產鏡像
npm run docker:prod         # 啟動生產環境
npm run docker:clean        # 清理所有容器和鏡像
```

#### Docker 配置說明

- **開發環境** (`docker-compose.dev.yml`)：
  - 支援 hot reload
  - 掛載源代碼目錄
  - 詳細日誌輸出

- **生產環境** (`docker-compose.prod.yml`)：
  - 優化構建
  - 資源限制
  - 健康檢查

#### 環境變數

複製 `env.template` 到 `.env.local` 並填入：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key
```

#### 常見問題

1. **權限問題**（Linux/macOS）：
```bash
sudo chown -R $USER:$USER .
```

2. **端口被佔用**：
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "3001:3000"  # 使用 3001 端口
```

3. **清理 Docker 資源**：
```bash
npm run docker:clean
docker system prune -a
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
