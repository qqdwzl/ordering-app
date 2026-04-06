# 🚀 Vercel 部署指南

## ✅ 代码已准备好

所有代码已推送到 GitHub：
https://github.com/qqdwzl/ordering-app

## 📝 部署步骤（5 分钟）

### 步骤 1：打开 Vercel

访问：https://vercel.com/new

### 步骤 2：导入 GitHub 仓库

1. 点击 **"Import Git Repository"**
2. 选择 **GitHub**（首次使用需要授权）
3. 找到 **qqdwzl/ordering-app** 仓库
4. 点击 **"Import"**

### 步骤 3：配置环境变量

在 **"Configure Project"** 页面，添加以下环境变量：

| Name | Value |
|------|-------|
| `FEISHU_APP_TOKEN` | `cli_a959e64357229bdb` |
| `FEISHU_APP_SECRET` | `JK2KpEEkwJwqQwjcDtGu6crZmEljMYMs` |

点击 **"Add"** 添加每个变量。

### 步骤 4：部署

1. 点击 **"Deploy"**
2. 等待约 1-2 分钟
3. 获得链接如：`https://xxx.vercel.app`

### 步骤 5：测试

1. 打开 Vercel 提供的链接
2. 点餐并下单
3. 检查飞书订单表格：https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc
4. 确认订单已写入

---

## 🔧 手动部署（使用 Vercel CLI）

如果你想在本地命令行部署：

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 进入项目目录
cd /home/admin/openclaw/workspace/ordering-app

# 4. 部署
vercel --prod

# 5. 设置环境变量（在 Vercel 控制台）
# 访问 https://vercel.com/dashboard
# 找到你的项目 → Settings → Environment Variables
# 添加 FEISHU_APP_TOKEN 和 FEISHU_APP_SECRET
```

---

## ✅ 部署后

### 点餐页面
`https://你的域名.vercel.app/`

### 管理后台
`https://你的域名.vercel.app/admin.html`

### 飞书订单表格
https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc

---

## 🎯 快速方案

如果不想用 Vercel，也可以：

1. **直接用飞书表格** - 手动录入订单
2. **用 GitHub Pages** - 继续当前部署，但订单存在本地

需要我帮你部署吗？
