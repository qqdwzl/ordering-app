# 🚀 Vercel 部署完成指南

## ✅ 代码已准备就绪

所有代码已推送到 GitHub：
**https://github.com/qqdwzl/ordering-app**

---

## 📝 部署步骤（5 分钟）

### 步骤 1：访问 Vercel

打开：https://vercel.com/new

### 步骤 2：导入仓库

1. 点击 **"Import Git Repository"**
2. 选择 **GitHub** 并授权
3. 找到 **qqdwzl/ordering-app**
4. 点击 **"Import"**

### 步骤 3：配置环境变量

在 **"Configure Project"** 页面添加：

| Name | Value |
|------|-------|
| `FEISHU_APP_TOKEN` | `cli_a959e64357229bdb` |
| `FEISHU_APP_SECRET` | `JK2KpEEkwJwqQwjcDtGu6crZmEljMYMs` |

点击 **"Add"** 添加每个变量。

### 步骤 4：部署

1. 点击 **"Deploy"**
2. 等待 1-2 分钟
3. 获得链接如：`https://xxx.vercel.app`

### 步骤 5：测试 API

打开：`https://xxx.vercel.app/api/health`

应该看到：
```json
{"success":true,"message":"点餐服务运行正常"}
```

---

## 🎯 部署完成后

### 点餐页面
`https://你的域名.vercel.app/`

### 管理后台
`https://你的域名.vercel.app/admin.html`

### API 接口
- `GET /api/menu` - 获取菜单
- `GET /api/orders` - 获取订单
- `POST /api/order` - 创建订单
- `PUT /api/order/:id` - 更新订单状态

---

## ✅ 功能说明

### 自动云端存储
- 顾客下单 → 自动写入飞书表格
- 管理后台 → 实时读取飞书数据
- 任何设备都能查看订单

### 飞书表格
**订单表**: https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc

---

## 🔧 本地测试

```bash
cd /home/admin/openclaw/workspace/ordering-app
npm install
FEISHU_APP_TOKEN=cli_a959e64357229bdb FEISHU_APP_SECRET=JK2KpEEkwJwqQwjcDtGu6crZmEljMYMs npm start
# 访问 http://localhost:3000
```

---

## 📱 使用流程

1. **顾客点餐**
   - 打开点餐页面
   - 选择菜品下单
   - 订单自动写入飞书表格

2. **店员管理**
   - 打开管理后台
   - 查看新订单
   - 标记"已完成"

3. **数据同步**
   - 所有设备实时同步
   - 数据永久保存

---

**部署后把 Vercel 链接发我，我帮你测试！** 🎉
