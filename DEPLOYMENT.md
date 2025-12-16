# 🫧 Floating Bubbles - Deployment Guide

## 📋 CI/CD Pipeline Overview

### Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - ✅ Linting & TypeScript type checking
   - ✅ Frontend build (React + Vite)
   - ✅ Backend validation
   - ✅ Docker image build & push
   - ✅ Security scanning (Trivy)
   - Triggered on: push to `main`/`develop`, PR

2. **Tests** (`.github/workflows/test.yml`)
   - ✅ Unit tests setup
   - ✅ Integration tests with PostgreSQL
   - Triggered on: push, PR

3. **Deploy** (`.github/workflows/deploy.yml`)
   - ✅ Auto-deployment to production
   - Triggered after CI/CD pipeline success
   - Requires SSH secrets for deployment

## 🚀 Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- npm

### Setup

```bash
# Clone repository
git clone <your-repo>
cd floating-bubbles

# Create .env file
cp .env.example .env

# Start all services
docker compose up -d

# View logs
docker compose logs -f app
docker compose logs -f db
```

### Development Commands

```bash
# Frontend development
cd client && npm run dev

# Backend development
cd server && npm run dev

# Build frontend
cd client && npm run build

# Stop all services
docker compose down
```

## 🐳 Docker Deployment

### Build Image Locally
```bash
docker build -t floating-bubbles:latest .
```

### Push to Registry (GitHub Container Registry)
```bash
docker tag floating-bubbles:latest ghcr.io/<your-username>/floating-bubbles:latest
docker push ghcr.io/<your-username>/floating-bubbles:latest
```

### Run Container
```bash
docker run -d \
  --name bubble_app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:123456@host.docker.internal:5432/bubble_db \
  ghcr.io/<your-username>/floating-bubbles:latest
```

## 🌐 Production Deployment

### GitHub Actions Secrets Setup

Add these secrets to your GitHub repository settings:

```
DEPLOY_HOST     - Server hostname/IP
DEPLOY_USER     - SSH username
DEPLOY_KEY      - SSH private key (for authentication)
```

### Server Setup

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone <your-repo> ~/floating-bubbles
cd ~/floating-bubbles

# Create production .env
cat > .env <<EOF
NODE_ENV=production
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=bubble_db
PORT=3000
EOF

# Start services
docker compose up -d
```

### Verify Deployment

```bash
# Check service health
curl http://localhost:3000/api/health
# Expected response: {"ok":true}

# View logs
docker compose logs app

# Database connection test
docker compose exec db psql -U postgres -d bubble_db -c "SELECT COUNT(*) FROM messages;"
```

## 📊 Monitoring & Logs

```bash
# View application logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# View specific container
docker logs bubble_pg
docker logs floating_bubbles_app

# Real-time monitoring
watch 'docker compose ps'
```

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check if DB is healthy
docker compose ps
# Status should be "healthy" or "running"

# Restart database
docker compose restart db
```

### Port Already in Use
```bash
# Change port in .env
echo "PORT=3001" >> .env

# Restart services
docker compose down
docker compose up -d
```

### Clear Everything (Fresh Start)
```bash
# Remove all services and volumes
docker compose down -v

# Rebuild and restart
docker compose up -d --build
```

## 🔐 Security Best Practices

- ✅ Environment variables in `.env` (not in code)
- ✅ `.env` file in `.gitignore`
- ✅ Use strong database password in production
- ✅ Enable GitHub Actions security scanning
- ✅ Use SSH keys (not passwords) for deployment
- ✅ Regularly update dependencies

## 📈 Performance Tips

- Use Alpine Linux images for smaller footprint
- Multi-stage Docker builds for optimized images
- Environment-specific configurations
- Health checks for auto-restart on failure

## 🚨 CI/CD Pipeline Status

Check your GitHub repository Actions tab to see:
- Build status
- Test results
- Security scan results
- Deployment logs
