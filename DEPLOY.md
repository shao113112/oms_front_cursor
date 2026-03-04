# OMS 前端部署说明

## 1. 本地构建

在项目根目录执行：

```bash
npm ci
npm run build
```

构建产物在 `dist/` 目录（静态文件，可直接用任意 Web 服务器托管）。

## 2. 配置生产环境 API 地址

- 构建前在项目根目录创建或修改 `.env.production`（可参考 `.env.example`）。
- 变量 `VITE_API_BASE`：
  - **前后端同域**：填 `/api`，由 Nginx 等把 `/api` 反向代理到后端服务。
  - **前后端不同域**：填后端完整根地址，例如 `https://api.yourdomain.com`（需后端配置 CORS）。

修改后需重新执行 `npm run build`。

## 3. 上传到服务器

将 `dist/` 目录下的全部文件上传到服务器（如 `/var/www/oms-front`），或通过 CI/CD 在服务器上执行 `npm run build` 后使用生成的 `dist/`。

## 4. Nginx 配置示例（前后端同域）

前端与后端在同一域名下时，用 Nginx 做反向代理并托管前端静态资源：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/oms-front;   # dist 内容所在目录
    index index.html;

    # 前端静态资源
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 接口代理到后端（与 .env.production 中 VITE_API_BASE=/api 对应）
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;   # 后端实际地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- 若后端在其它机器，将 `proxy_pass` 改为后端地址，如 `http://backend-server:8080/`。
- 使用 HTTPS 时，在 Nginx 中配置 `ssl_certificate` 等，或前面加一层 SSL 终结。

## 5. 后端需配合的事项

- 若前后端不同域，后端需允许前端域名的 CORS。
- 若使用 Nginx 反向代理，确认后端监听的端口（如 8080）与 `proxy_pass` 一致。
- 会话/Token 与登录接口路径与本地一致（如 `/api/users/login`），一般无需改前端。

## 6. 服务器构建报错（Core.cpp / propagateSizeHints / setParent）

若在服务器上执行 `npm run build` 出现与 `Core.cpp`、`propagateSizeHints()`、`setParent` 相关的报错，多半是系统 PATH 里存在同名的其它可执行程序（如 Qt 应用），导致没有用到项目内的 Vite。

项目已改为通过 `node node_modules/vite/bin/vite.js build` 调用 Vite，保证使用本地的 Vite。请先拉取最新代码再执行：

```bash
npm ci
npm run build
```

若仍有问题，可手动执行：

```bash
node node_modules/vite/bin/vite.js build
```

## 7. 简要检查清单

- [ ] 已执行 `npm run build`，无报错
- [ ] 已配置 `.env.production` 中的 `VITE_API_BASE`
- [ ] `dist/` 已上传或由服务器构建生成
- [ ] Nginx（或其它 Web 服务器）已配置：静态资源 + SPA 回退到 `index.html`，且 `/api` 代理到后端
- [ ] 在浏览器访问前端地址，能打开登录页且接口请求正常
