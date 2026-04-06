# 🚀 点餐系统部署指南

## 方案一：Vercel 部署（最简单 ⭐推荐）

**优点**：无需代码、拖拽上传、自动 HTTPS、免费

### 步骤：

1. 打开 https://vercel.com/new
2. 用 GitHub/GitLab/Bitbucket 登录
3. 点击 **"Add New..."** → **"Project"**
4. 把 `ordering-app` 文件夹**拖拽**到上传区域
5. 等待部署完成（约 30 秒）
6. 获得链接如：`https://your-app.vercel.app`

### 或直接使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 进入项目目录
cd /home/admin/openclaw/workspace/ordering-app

# 部署
vercel --prod
```

---

## 方案二：Netlify Drop（同样简单）

**优点**：拖拽上传、免费、HTTPS

### 步骤：

1. 打开 https://app.netlify.com/drop
2. 把 `ordering-app` 文件夹**拖拽**到页面
3. 获得链接如：`https://random-name.netlify.app`
4. （可选）注册账号后自定义域名

---

## 方案三：GitHub Pages（需要 Git 配置）

**优点**：完全免费、稳定、可自定义域名

### 步骤：

```bash
# 1. 配置 Git（首次使用）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 2. 初始化仓库
cd /home/admin/openclaw/workspace/ordering-app
git init
git add .
git commit -m "Initial commit"

# 3. 创建 GitHub 仓库（在 GitHub 网站）
# 访问 https://github.com/new
# 创建仓库名如：ordering-app

# 4. 关联并推送
git remote add origin https://github.com/YOUR_USERNAME/ordering-app.git
git branch -M main
git push -u origin main

# 5. 开启 GitHub Pages
# 仓库 → Settings → Pages → Source 选 "main" → Save
# 获得链接：https://YOUR_USERNAME.github.io/ordering-app
```

---

## 方案四：飞书云空间（内部使用）

**优点**：无需外部服务、团队内访问

### 步骤：

1. 把 `index.html` 上传到飞书云空间
2. 右键文件 → 分享 → 创建链接
3. 但注意：飞书云空间可能无法直接运行 HTML，需要下载后打开

---

## 📱 生成二维码

部署获得链接后，生成二维码供顾客扫描：

### 在线工具：
- https://www.qr-code-generator.com/
- https://cli.im/

### 命令行（如有 qrencode）：
```bash
qrencode -o qr.png "https://your-app.vercel.app"
```

---

## ✅ 部署后测试

1. 用手机浏览器打开链接
2. 点餐、下单、支付
3. 检查订单是否生成

---

## 🔧 后续配置

### 接入飞书 API（写入真实订单）

1. 去飞书开放平台创建应用：https://open.feishu.cn/
2. 获取 `App Token` 和 `App Secret`
3. 在 Vercel/Netlify 配置环境变量：
   - `FEISHU_APP_TOKEN`
   - `FEISHU_APP_SECRET`
4. 使用 `index-api.html` 替换 `index.html`

### 自定义域名

- Vercel/Netlify 都支持绑定自己的域名
- GitHub Pages 也支持

---

## 💡 推荐流程

1. **先用 Vercel 部署**（5 分钟搞定）
2. **测试功能**（手机扫码点餐）
3. **需要真实订单时再接飞书 API**

---

**需要我帮你执行哪个方案？** 回复数字即可：
- `1` - Vercel（推荐）
- `2` - Netlify
- `3` - GitHub Pages
