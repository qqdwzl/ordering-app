# 🔐 飞书 API 配置指南

要让订单云端存储到飞书表格，需要配置飞书开放平台应用。

## 📝 步骤 1：创建自建应用

1. 打开 https://open.feishu.cn/app
2. 点击 **"创建应用"**
3. 填写：
   - **应用名称**：点餐系统
   - **应用图标**：随便选一个
4. 点击 **"创建"**

## 🔑 步骤 2：获取凭证

创建后，在应用页面找到：
- **App ID**（即 App Token）
- **App Secret**

点击 **"查看"** 复制这两个值。

## 📊 步骤 3：添加多维表格权限

1. 进入应用 → **"权限管理"**
2. 点击 **"申请权限"**
3. 搜索并添加以下权限：
   - `bitable:app` - 访问多维表格
   - `base:app` - 访问应用
4. 点击 **"提交申请"**（通常自动批准）

## 📁 步骤 4：授权访问表格

1. 进入应用 → **"版本管理与发布"**
2. 点击 **"发布"** 应用（首次需要）
3. 回到 **"权限管理"**
4. 找到 **"用户和群组"** 或 **"机器人"**
5. 确保应用能访问你的飞书表格

## 🔗 步骤 5：获取表格信息

打开你的订单表格：
https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc

从 URL 中获取：
- **App Token**: `IA4Ubm6sqaGEY1sCNNvcXiwxnPc`
- **Table ID**: `tblSsCpLNnXs4C9c`

## ⚙️ 步骤 6：配置到项目

创建 `.env` 文件（在项目根目录）：

```env
FEISHU_APP_TOKEN=你的 App ID
FEISHU_APP_SECRET=你的 App Secret
FEISHU_ORDER_APP_TOKEN=IA4Ubm6sqaGEY1sCNNvcXiwxnPc
FEISHU_ORDER_TABLE_ID=tblSsCpLNnXs4C9c
FEISHU_MENU_APP_TOKEN=Dksab1gRia0IMIs82wBcueoTnYn
FEISHU_MENU_TABLE_ID=tblD10SLC5ii6jKG
```

## 🚀 步骤 7：部署后端

### 方案 A：Vercel 部署（推荐）

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 进入项目目录：
```bash
cd /home/admin/openclaw/workspace/ordering-app
```

3. 部署并配置环境变量：
```bash
vercel --prod
# 按提示设置环境变量
```

### 方案 B：本地运行

```bash
cd /home/admin/openclaw/workspace/ordering-app
npm install
FEISHU_APP_TOKEN=xxx FEISHU_APP_SECRET=xxx npm start
```

## 📱 步骤 8：更新前端

将 `index.html` 中的 API 地址改为你的后端地址：

```javascript
const API_BASE = 'https://你的域名.vercel.app/api';
```

或者直接用 `index-api.html` 替换 `index.html`。

## ✅ 测试

1. 打开点餐页面
2. 下一个订单
3. 检查飞书订单表格是否有新记录
4. 打开管理后台查看订单

---

## 💡 快速方案

如果不想配置 API，可以用这个变通方法：

1. 在飞书表格中创建一个 **"表单"**
2. 顾客下单后，手动复制订单到表格
3. 或者用飞书自动化机器人推送订单

需要我帮你配置吗？把 App Token 和 App Secret 发给我即可。
