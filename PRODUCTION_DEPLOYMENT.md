# 🚀 BREWLUXE Production Deployment Guide

This guide covers deploying BREWLUXE to production environments using Docker, cloud platforms, or traditional servers.

## Quick Start (Single Command Deploy)

### Option 1: Local Docker (Development/Testing)
```bash
docker compose -f docker-compose.single.yml up --build -d
```
- **Access:** http://localhost:3000
- **Database:** Persisted in ./server/brewluxe.db
- **Use case:** Local testing, demos

### Option 2: Multi-Container Docker (Production)
```bash
docker compose up --build -d
```
- **Frontend:** http://localhost:5520 (nginx)
- **Backend API:** http://localhost:3000 (Node.js)
- **Database:** ./server/brewluxe.db
- **Use case:** Staging, production-ready separation of concerns

## Cloud Deployment Options

### AWS (Amazon Web Services)

#### Using AWS ECS (Recommended)
1. **Push image to ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ECR_URI>
   docker build -t brewluxe .
   docker tag brewluxe:latest <YOUR_ECR_URI>/brewluxe:latest
   docker push <YOUR_ECR_URI>/brewluxe:latest
   ```

2. **Create ECS Task Definition** (brewluxe-task.json):
   ```json
   {
     "family": "brewluxe-app",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "brewluxe",
         "image": "<YOUR_ECR_URI>/brewluxe:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "hostPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/brewluxe",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

3. **Create ECS Service:**
   ```bash
   aws ecs register-task-definition --cli-input-json file://brewluxe-task.json
   aws ecs create-service --cluster brewluxe-cluster \
     --service-name brewluxe-service \
     --task-definition brewluxe-app \
     --desired-count 1 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
   ```

#### Using AWS EC2 (Simple)
1. Launch an Ubuntu EC2 instance
2. SSH into the instance:
   ```bash
   ssh -i your-key.pem ubuntu@<your-instance-ip>
   ```

3. Install Docker and Docker Compose:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

4. Clone the repository:
   ```bash
   git clone https://github.com/Sthitirath24/brewluxe--web.git
   cd brewluxe--web
   ```

5. Start the app:
   ```bash
   docker compose -f docker-compose.single.yml up -d
   ```

6. (Optional) Set up Nginx reverse proxy for port 80:
   ```bash
   sudo apt install -y nginx
   ```
   
   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Then:
   ```bash
   sudo systemctl restart nginx
   ```

### Google Cloud Platform (GCP)

#### Using Cloud Run
1. **Build and push image:**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/brewluxe
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy brewluxe \
     --image gcr.io/YOUR_PROJECT_ID/brewluxe \
     --platform managed \
     --region us-central1 \
     --port 3000 \
     --memory 512Mi \
     --allow-unauthenticated
   ```

3. **Use Cloud SQL for database** (optional):
   - Create Cloud SQL instance (MySQL/PostgreSQL)
   - Update connection string in `server/server.js`

#### Using Compute Engine (VM)
Similar to AWS EC2:
1. Create a VM instance
2. Install Docker
3. Clone and run with Docker Compose

### Azure (Microsoft Azure)

#### Using Container Instances
```bash
# Create resource group
az group create --name brewluxe-rg --location eastus

# Build and push image
az acr build --registry <your-acr-name> --image brewluxe:latest .

# Deploy container
az container create \
  --resource-group brewluxe-rg \
  --name brewluxe-app \
  --image <your-acr-name>.azurecr.io/brewluxe:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

#### Using App Service
```bash
# Create App Service Plan
az appservice plan create --name brewluxe-plan --resource-group brewluxe-rg

# Create Web App
az webapp create --resource-group brewluxe-rg --plan brewluxe-plan --name brewluxe-app

# Configure Docker
az webapp config container set --name brewluxe-app \
  --resource-group brewluxe-rg \
  --docker-custom-image-name <your-image-url>
```

### Heroku (Quickest)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create brewluxe-app
   ```

3. **Set buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Verify:**
   ```bash
   heroku logs --tail
   heroku open
   ```

### DigitalOcean (Affordable)

1. **Create Droplet** (Ubuntu 20.04, 1GB RAM minimum)

2. **Initial setup:**
   ```bash
   ssh root@your_droplet_ip
   apt update && apt upgrade -y
   apt install -y docker.io docker-compose nginx curl
   ```

3. **Deploy:**
   ```bash
   git clone https://github.com/Sthitirath24/brewluxe--web.git
   cd brewluxe--web
   docker compose -f docker-compose.single.yml up -d
   ```

4. **Setup SSL with Let's Encrypt:**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot certonly --standalone -d your-domain.com
   ```

## Environment Variables

Create a `.env` file in the server directory:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=./brewluxe.db
LOG_LEVEL=info
CORS_ORIGIN=https://your-domain.com
```

## Database Backup & Recovery

### Backup SQLite Database
```bash
# Local backup
cp server/brewluxe.db server/brewluxe.db.backup.$(date +%Y%m%d_%H%M%S)

# Or using Docker
docker exec brewluxe-app sqlite3 /app/server/brewluxe.db ".backup /tmp/backup.db"
docker cp brewluxe-app:/tmp/backup.db ./brewluxe.db.backup
```

### Restore Database
```bash
cp server/brewluxe.db.backup server/brewluxe.db
docker restart brewluxe-app
```

### Migrate to PostgreSQL (Production Recommended)
1. Install PostgreSQL
2. Update `server/server.js` to use pg driver
3. Export data from SQLite
4. Import to PostgreSQL

## Monitoring & Logging

### Docker Logs
```bash
# View logs
docker logs brewluxe-app -f

# View logs with timestamps
docker logs -t brewluxe-app | tail -100
```

### Health Check
```bash
# From outside container
curl http://localhost:3000/api/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-11-28T16:58:53.898Z",
  "database": "connected"
}
```

### Metrics & Monitoring
- **PM2 (Node.js monitoring):** `npm install -g pm2`
- **DataDog:** Set up DataDog agent in Docker
- **New Relic:** Configure with APM key
- **CloudWatch:** AWS native monitoring
- **Prometheus:** Container metrics scraping

## Scaling

### Horizontal Scaling (Multiple Instances)
```bash
# Docker Swarm
docker swarm init
docker stack deploy -c docker-compose.single.yml brewluxe

# Kubernetes
kubectl apply -f k8s-deployment.yaml
kubectl scale deployment brewluxe-app --replicas=3
```

### Vertical Scaling
- Increase container memory: Update `docker-compose.yml` memory limits
- Increase CPU allocation: Update compose resources
- Optimize database queries in `server/server.js`

## Security Checklist

- [ ] Use HTTPS/TLS (Let's Encrypt)
- [ ] Set strong CORS origins
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] API key rotation
- [ ] WAF (Web Application Firewall)

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Runs tests on every push
- Builds Docker image
- Pushes to GitHub Container Registry
- Deploys to production (main branch only)

### Trigger Workflow
```bash
git push origin main
```

Monitor at: `https://github.com/Sthitirath24/brewluxe--web/actions`

## Troubleshooting

### Container won't start
```bash
docker logs brewluxe-app
docker logs --tail 50 brewluxe-app
```

### Database locked error
```bash
# Ensure only one container/process accesses the database
docker ps
docker exec brewluxe-app sqlite3 /app/server/brewluxe.db ".tables"
```

### Port already in use
```bash
# Kill process using port 3000
sudo lsof -i :3000
sudo kill -9 <PID>
```

### CORS errors
Check `CORS_ORIGIN` in environment variables matches frontend domain.

## Support

For deployment issues:
1. Check logs: `docker logs brewluxe-app`
2. Verify health: `curl http://localhost:3000/api/health`
3. Test database: `curl http://localhost:3000/api/menu`
4. Review .env configuration

---

**Deployment complete! 🎉**

Your BREWLUXE app is ready for production.

