# Floating Messages (Bubble Messages)

Dự án demo DevOps/CI-CD: người dùng nhập **lời nhắn + tên người gửi** → **Backend Node.js** lưu vào **PostgreSQL** → **Frontend React (Vite)** hiển thị lời nhắn dạng **bong bóng lơ lửng**.

---

## 1) Tổng quan kiến trúc

- **Frontend (client)**: SPA (Single Page Application) chạy trên trình duyệt.
- **Backend (server)**: REST API (Express) xử lý tạo/lấy lời nhắn.
- **Database**: PostgreSQL lưu dữ liệu lời nhắn.
- **Deploy**:
  - FE: Vercel
  - BE: Render
  - DB: Render PostgreSQL
- **CI/CD**: GitHub Actions tự động chạy lint/build/test.

Luồng dữ liệu chính:
1. Người dùng nhập `sender` + `content` trên FE.
2. FE gọi API `POST /api/messages` tới BE.
3. BE insert dữ liệu vào Postgres.
4. FE polling API `GET /api/messages?limit=N` để cập nhật bong bóng.

---

## 2) Frontend (Vite + React + TypeScript)

### 2.1 Công nghệ chính
- **Vite**
- **React + TypeScript + TailwindCSS**


### 2.2 📁 Cấu trúc project
```txt
.
├── client/                 # Frontend (Vite + React + TS + Tailwind)
│   ├── public/            # Static assets
│   └── src/
│       ├── api/           # Gọi API backend
│       ├── assets/        # Ảnh nền
│       ├── components/    # UI components (Bubble, Background, Composer...)
│       ├── hooks/         # Custom hooks (polling, send message...)
│       ├── toast/         # Toast provider + viewport + hook
│       ├── types/         # TypeScript types
│       └── utils/         # Helper functions (format, random...)
│
├── server/                 # Backend (Node.js + Express + PostgreSQL)
│
├── .github/
│   └── workflows/         # CI/CD pipelines (CI, Tests, Deploy)
```

### 2.3 Cấu hình môi trường

Tạo file `.env` với các biến môi trường cần thiết

**client**
```env
VITE_API_BASE=http://localhost:3000
```
**server**
```env
PORT=3000
DATABASE_URL=postgresql://postgres:123456@localhost:5432/bubble_db
```
## 3) Backend (Node.js + Express)

### 3.1 Công nghệ chính
- **Node.js**: **Express** : **PostgreSQL**

---

## 4) Database (PostgreSQL)

### 4.1 Local bằng Docker Compose
Dùng `docker-compose.yml` để tạo Postgres local:

Chạy:
```bash
docker compose up -d
```

### 4.2 Production trên Render
- Tạo **Render PostgreSQL**.
- Lấy **Internal Database URL** gắn vào env `DATABASE_URL` của Web Service backend.

---

## 5) CI/CD (GitHub Actions)

### 6.1 Mục tiêu CI
- Kiểm tra code trước khi deploy:
  - cài dependencies (`npm ci`)
  - lint (`npm run lint`)
  - build (`npm run build`)
  - test (`npm run test`)

### 6.2 Jobs điển hình
- **CI**:
  - Job `client`: lint/build FE
  - Job `server`: lint/build hoặc check syntax BE
- **Tests**:
  - Service `postgres` trong workflow để chạy test integration
- **Deploy (tuỳ chọn)**:
  - Trigger Render Deploy Hook khi push lên `master/main`.

### 6.3 Secrets & Variables
- `RENDER_BACKEND_HOOK`: URL deploy hook của Render.
---

## 7) DevOps/Deploy (Vercel + Render)

### 7.1 Deploy Frontend (Vercel)
- Connect GitHub repo.
- Set env: `VITE_API_BASE` trỏ về Render backend.
- Build command: `npm run build`
- Output: `dist/` (Vite default)

### 7.2 Deploy Backend (Render)
- Create Web Service:
  - Runtime: Docker hoặc Node.
  - Root directory: `server/` 
- Set env:
  - `DATABASE_URL` = Internal Database URL từ Render Postgres
- CORS:
  - allow origin domain Vercel <a href="https://bubble-messages.vercel.app" target="_blank">https://bubble-messages.vercel.app</a>
---

### DevOps / CI-CD
- Docker, Docker Compose
- GitHub Actions
- Render (Web Service + PostgreSQL)
- Vercel (Frontend hosting)

---

## 8) Link tài liệu triển khai
👉 Hướng dẫn deploy: xem [DEPLOYMENT.md](./DEPLOYMENT.md)
