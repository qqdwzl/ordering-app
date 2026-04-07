#!/usr/bin/env node
/**
 * 测试订单写入脚本
 * 使用方法：node TEST_ORDER.js
 * 
 * 需要先设置环境变量：
 * export FEISHU_APP_TOKEN=your_app_token
 * export FEISHU_APP_SECRET=your_app_secret
 */

const fetch = require('node-fetch');

// 配置
const CONFIG = {
    appToken: process.env.FEISHU_APP_TOKEN,
    appSecret: process.env.FEISHU_APP_SECRET,
    orderAppToken: 'IA4Ubm6sqaGEY1sCNNvcXiwxnPc',
    orderTableId: 'tblSsCpLNnXs4C9c'
};

async function getAccessToken() {
    const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            app_id: CONFIG.appToken,
            app_secret: CONFIG.appSecret
        })
    });
    
    const data = await res.json();
    if (data.code === 0) {
        return data.tenant_access_token;
    }
    throw new Error('获取 token 失败：' + data.msg);
}

async function createTestOrder() {
    try {
        console.log('🔐 正在获取飞书 access token...');
        const token = await getAccessToken();
        console.log('✅ Token 获取成功');
        
        const orderNumber = 'TEST' + Date.now();
        const timestamp = Date.now();
        const itemDetail = '桌号：1 号 | 一雷虾球 x1, 一雨玫瑰拿铁 x1 | 备注：测试订单';
        
        console.log(`📝 创建测试订单：${orderNumber}`);
        
        const res = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${CONFIG.orderAppToken}/tables/${CONFIG.orderTableId}/records`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        '订单号': orderNumber,
                        '菜品详情': itemDetail,
                        '总金额': 36,
                        '下单时间': timestamp,
                        '支付状态': '已支付'
                    }
                })
            }
        );
        
        const data = await res.json();
        if (data.code === 0) {
            console.log('✅ 订单创建成功！');
            console.log(`📋 订单号：${orderNumber}`);
            console.log(`🔗 查看订单表：https://ncnhcka6rbxm.feishu.cn/base/${CONFIG.orderAppToken}`);
            return true;
        } else {
            console.error('❌ 订单创建失败:', data.msg);
            return false;
        }
    } catch (err) {
        console.error('❌ 错误:', err.message);
        return false;
    }
}

// 主程序
if (!CONFIG.appToken || !CONFIG.appSecret) {
    console.log('❌ 缺少环境变量');
    console.log('请先设置：');
    console.log('  export FEISHU_APP_TOKEN=your_app_token');
    console.log('  export FEISHU_APP_SECRET=your_app_secret');
    process.exit(1);
}

createTestOrder().then(success => {
    process.exit(success ? 0 : 1);
});
