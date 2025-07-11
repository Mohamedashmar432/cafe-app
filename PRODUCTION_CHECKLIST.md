# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### 🔧 Environment Setup
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Configure `FRONTEND_URL` for production domain
- [ ] Set up production database path
- [ ] Configure CORS origins for production domain

### 🗄️ Database
- [ ] Backup existing data (if any)
- [ ] Consider migrating from SQLite to PostgreSQL/MySQL
- [ ] Set up database backups
- [ ] Configure database connection pooling
- [ ] Test database performance

### 🔒 Security
- [ ] Change default admin password
- [ ] Review and update JWT secret
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure security headers
- [ ] Review CORS settings

### 🌐 Infrastructure
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure load balancer (if needed)
- [ ] Set up monitoring and logging
- [ ] Configure process manager (PM2)
- [ ] Set up automatic restarts
- [ ] Configure log rotation

## 🏗️ Deployment Steps

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd cafe-app

# Build application
./build.sh

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-super-secure-jwt-secret
export FRONTEND_URL=https://your-domain.com
export DB_PATH=/var/lib/cafe-app/cafe.db

# Create database directory
sudo mkdir -p /var/lib/cafe-app
sudo chown $USER:$USER /var/lib/cafe-app
```

### 3. Process Management
```bash
# Start backend with PM2
cd backend
pm2 start server.js --name "cafe-backend" --env production

# Start frontend (if needed)
cd ..
pm2 start "npm run preview" --name "cafe-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend
    location / {
        root /path/to/cafe-app/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

### 5. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Monitoring Setup
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Set up log monitoring
sudo mkdir -p /var/log/cafe-app
sudo chown $USER:$USER /var/log/cafe-app

# Configure log rotation
sudo tee /etc/logrotate.d/cafe-app << EOF
/var/log/cafe-app/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
```

## 📊 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
```

### Application Optimization
```bash
# Enable compression
npm install compression

# Set up caching headers
npm install helmet

# Configure PM2 with clustering
pm2 start server.js --name "cafe-backend" -i max
```

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# Create health check script
cat > /usr/local/bin/cafe-health-check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:5000/health || exit 1
curl -f http://localhost:8080/ || exit 1
EOF

chmod +x /usr/local/bin/cafe-health-check.sh

# Add to crontab
# */5 * * * * /usr/local/bin/cafe-health-check.sh
```

### Backup Strategy
```bash
# Database backup script
cat > /usr/local/bin/cafe-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/cafe-app"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
cp /var/lib/cafe-app/cafe.db $BACKUP_DIR/cafe_$DATE.db

# Backup logs
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz /var/log/cafe-app/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/cafe-backup.sh

# Add to crontab (daily at 2 AM)
# 0 2 * * * /usr/local/bin/cafe-backup.sh
```

## 🚨 Emergency Procedures

### Application Restart
```bash
# Restart all services
pm2 restart all

# Check status
pm2 status
pm2 logs
```

### Database Recovery
```bash
# Stop application
pm2 stop all

# Restore database
cp /var/backups/cafe-app/cafe_YYYYMMDD_HHMMSS.db /var/lib/cafe-app/cafe.db

# Restart application
pm2 start all
```

### Rollback Procedure
```bash
# Revert to previous version
git checkout <previous-tag>
./build.sh
pm2 restart all
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement session sharing (Redis)
- Use external database (PostgreSQL/MySQL)
- Set up CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)
- Use connection pooling

## 🔐 Security Hardening

### Additional Security Measures
```bash
# Install fail2ban
sudo apt install fail2ban -y

# Configure fail2ban for SSH and web
sudo tee /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF

sudo systemctl restart fail2ban
```

### Regular Security Updates
```bash
# Set up automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📞 Support & Documentation

### Contact Information
- **System Administrator**: [Your Contact]
- **Emergency Contact**: [Emergency Contact]
- **Hosting Provider**: [Provider Contact]

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [User Manual](./USER_MANUAL.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

**🎉 Your Cafe Billing Application is now production-ready!**

Remember to:
- Monitor the application regularly
- Keep backups up to date
- Update dependencies regularly
- Review security settings periodically
- Test disaster recovery procedures 