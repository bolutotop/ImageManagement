
# ImageManagement

基于 Next.js (App Router) 构建的轻量级、无云存储依赖的纯本地化图片资产管理中心。

架构说明 (Architecture)
* **前端/API框架**: Next.js 16 (React Server Components)
* **持久化存储**: 本地文件系统 (`/storage` 目录) + 动态路由 (`/uploads/[filename]`) 动静分离下发。
* **数据库**: SQLite (Prisma ORM v6 驱动)
* **进程守护**: PM2 (Process Daemon)
* **网络穿透**: Cloudflare Tunnel (解决 HTTPS 混合内容拦截与内网穿透)

---

## 环境准备 (Prerequisites)

### 在 Debian/Ubuntu 服务器上执行初始化：

```npm install -g pm2```安装pm2进程管理

```bash
curl -L --output cloudflared.deb [https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb](https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb)
sudo dpkg -i cloudflared.deb
```

### 安装依赖:

```bash
npm install prisma@6 @prisma/client@6 --save-exact

npm install

mkdir .env
```

.env 写入 DATABASE_URL="file:./dev.db"

### 数据库同步:
```bash
npx prisma generate

npx prisma db push

npm run build

mkdir ecosystem.config.js
```
写入
```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "img-manager",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        PORT: 56622, // 内部监听端口
        NODE_ENV: "production"
      }
    },
    {
      name: "cf-tunnel",
      script: "/usr/bin/cloudflared", // 必须替换为绝对路径
      args: "tunnel --url http://localhost:56622",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
```

### 启动
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd # 执行后需复制终端提示的命令再运行一次
```

### 获取最新的 trycloudflare.com 域名
```bash
pm2 logs cf-tunnel --lines 30 --nostream
```

## 目前域名

https://laws-happening-aspects-installation.trycloudflare.com/