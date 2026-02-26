module.exports = {
  apps: [
    {
      name: "img-manager",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: { PORT: 56622, NODE_ENV: "production" }
    },
    {
      name: "cf-tunnel",
      script: "/usr/bin/cloudflared", // 需通过 which cloudflared 确认绝对路径
      args: "tunnel --url http://localhost:56622",
      log_date_format: "YYYY-MM-DD HH:mm Z" // 方便查看随机生成的域名
    }
  ]
};