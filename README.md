# 🍽️ 简易点餐系统

一个超简单的点餐小程序，GitHub Pages 托管，无需服务器。

## 🔗 访问链接

**点餐页面**: https://qqdwzl.github.io/ordering-app/  
**管理后台**: https://qqdwzl.github.io/ordering-app/admin.html

## 📊 飞书表格

**菜单表**: https://ncnhcka6rbxm.feishu.cn/base/Dksab1gRia0IMIs82wBcueoTnYn  
**订单表**: https://ncnhcka6rbxm.feishu.cn/base/IA4Ubm6sqaGEY1sCNNvcXiwxnPc

## ✨ 功能

### 点餐页面
- ✅ 分类菜单展示
- ✅ 一键加入购物车
- ✅ 实时计算总价
- ✅ 模拟支付流程
- ✅ 生成订单号

### 管理后台
- ✅ 订单列表查看
- ✅ 订单详情查看
- ✅ 状态筛选（待支付/已支付/已完成）
- ✅ 日期筛选
- ✅ 搜索订单
- ✅ 标记完成/取消订单
- ✅ 导出 Excel/CSV

## 📱 使用说明

### 顾客点餐
1. 打开点餐页面
2. 选择菜品加入购物车
3. 点击"去结算"
4. 确认订单并支付
5. 获得订单号

### 店员管理
1. 打开管理后台
2. 查看新订单
3. 制作完成后标记"已完成"
4. 可导出订单报表

## 💾 数据存储

**当前模式**: 本地存储（订单保存在顾客浏览器）

**升级到云端存储**:
1. 部署后端服务（如 Vercel）
2. 配置飞书 API 凭证
3. 修改 `index.html` 中的 `API_BASE` 为后端地址
4. 订单自动同步到飞书表格

## 🔧 自定义菜单

编辑 `index.html` 中的 `localMenuData`:

```javascript
const localMenuData = [
    { category: '主食', items: [
        { name: '你的菜品', price: 99 }
    ]}
];
```

## 📦 文件结构

```
ordering-app/
├── index.html          # 点餐页面
├── admin.html          # 管理后台
├── server.js           # 后端服务（云端存储用）
├── package.json        # Node.js 依赖
├── vercel.json         # Vercel 部署配置
├── README.md           # 使用说明
└── API_SETUP.md        # 飞书 API 配置指南
```

## 🚀 部署

### GitHub Pages（当前）
代码已自动部署到：
https://qqdwzl.github.io/ordering-app/

### Vercel（云端存储）
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 配置环境变量：
   - `FEISHU_APP_TOKEN`
   - `FEISHU_APP_SECRET`
4. 部署完成

## 📝 更新日志

- **v1.2** - 支持云端存储配置，飞书表格集成
- **v1.1** - 添加订单管理后台
- **v1.0** - 初始版本，基础点餐功能

---

**创建时间**: 2026-04-06  
**版本**: 1.2  
**许可**: MIT
