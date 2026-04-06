# 📋 订单管理后台 - 简化版

## 🔗 快速访问

**飞书订单表格**：https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc

直接在飞书表格中查看和管理订单！

## 📊 功能

### 本地存储版（当前）
- 订单保存在顾客浏览器
- 需要在同一设备查看
- 适合测试和小规模使用

### 云端存储版（推荐）
- 订单实时写入飞书表格
- 任何设备都能查看
- 数据永久保存

## 🚀 升级到云端存储

### 步骤 1：配置飞书 API

1. 打开 https://open.feishu.cn/app
2. 创建应用或选择现有应用
3. 获取 **App ID** 和 **App Secret**

### 步骤 2：部署后端

```bash
cd /home/admin/openclaw/workspace/ordering-app
npm install
FEISHU_APP_TOKEN=你的 App ID FEISHU_APP_SECRET=你的 App Secret npm start
```

或用 Vercel 部署：
```bash
npm install -g vercel
vercel --prod
# 按提示设置环境变量
```

### 步骤 3：更新前端

编辑 `admin.html`，修改配置：
```javascript
const API_BASE = 'https://你的域名.vercel.app/api';
```

### 步骤 4：重新部署

```bash
git add .
git commit -m "配置云端存储"
git push
```

## 💡 临时方案

如果不想配置 API，可以直接：

1. **打开飞书表格**：https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc
2. 在表格中查看所有订单
3. 手动更新订单状态

---

**当前版本**: 1.1（本地存储）  
**下一步**: 配置飞书 API 实现云端存储
