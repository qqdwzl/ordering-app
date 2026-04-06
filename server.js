const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// 飞书 API 配置
const FEISHU_CONFIG = {
    // 菜单表
    menuAppToken: 'Dksab1gRia0IMIs82wBcueoTnYn',
    menuTableId: 'tblD10SLC5ii6jKG',
    // 订单表
    orderAppToken: 'IA4Ubm6sqaGEY1sCNNvcXiwxnPc',
    orderTableId: 'tblSsCpLNnXs4C9c',
    // 需要从飞书开放平台获取
    appToken: process.env.FEISHU_APP_TOKEN || '',
    appSecret: process.env.FEISHU_APP_SECRET || ''
};

let accessToken = '';

// 获取飞书 access token
async function getAccessToken() {
    if (accessToken) return accessToken;
    
    const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            app_id: FEISHU_CONFIG.appToken,
            app_secret: FEISHU_CONFIG.appSecret
        })
    });
    
    const data = await res.json();
    if (data.code === 0) {
        accessToken = data.tenant_access_token;
        return accessToken;
    }
    throw new Error('获取飞书 token 失败');
}

// 获取菜单
app.get('/api/menu', async (req, res) => {
    try {
        const token = await getAccessToken();
        const res = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.menuAppToken}/tables/${FEISHU_CONFIG.menuTableId}/records`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await res.json();
        
        if (data.code === 0) {
            const menu = data.data.items.map(item => ({
                id: item.record_id,
                name: item.fields['菜品名称'],
                price: item.fields['价格'],
                category: item.fields['分类'],
                available: item.fields['是否在售'] !== false
            })).filter(item => item.available);
            
            // 按分类分组
            const grouped = {};
            menu.forEach(item => {
                if (!grouped[item.category]) grouped[item.category] = [];
                grouped[item.category].push(item);
            });
            
            res.json({ success: true, data: grouped });
        } else {
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 创建订单
app.post('/api/order', async (req, res) => {
    try {
        const { items, total } = req.body;
        const token = await getAccessToken();
        
        const orderNumber = 'ORD' + Date.now();
        const itemDetail = items.map(i => `${i.name} x${i.quantity}`).join(', ');
        
        const fetchRes = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records`,
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
                        '总金额': total,
                        '下单时间': Date.now(),
                        '支付状态': '已支付'
                    }
                })
            }
        );
        
        const data = await fetchRes.json();
        if (data.code === 0) {
            res.json({ success: true, orderNumber });
        } else {
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`点餐服务运行在 http://localhost:${PORT}`);
    console.log('请配置飞书 API 凭证：FEISHU_APP_TOKEN 和 FEISHU_APP_SECRET');
});
