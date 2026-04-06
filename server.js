const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// 飞书 API 配置
const FEISHU_CONFIG = {
    appToken: process.env.FEISHU_APP_TOKEN || 'cli_a959e64357229bdb',
    appSecret: process.env.FEISHU_APP_SECRET || 'JK2KpEEkwJwqQwjcDtGu6crZmEljMYMs',
    menuAppToken: 'Dksab1gRia0IMIs82wBcueoTnYn',
    menuTableId: 'tblD10SLC5ii6jKG',
    orderAppToken: 'IA4Ubm6sqaGEY1sCNNvcXiwxnPc',
    orderTableId: 'tblSsCpLNnXs4C9c'
};

let accessToken = '';
let tokenExpiry = 0;

// 获取飞书 access token
async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }
    
    try {
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
            tokenExpiry = Date.now() + (data.expire - 100) * 1000; // 提前 100 秒刷新
            return accessToken;
        }
        throw new Error('获取飞书 token 失败：' + data.msg);
    } catch (err) {
        console.error('Token 错误:', err);
        throw err;
    }
}

// 获取菜单
app.get('/api/menu', async (req, res) => {
    try {
        const token = await getAccessToken();
        const fetchRes = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.menuAppToken}/tables/${FEISHU_CONFIG.menuTableId}/records`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await fetchRes.json();
        
        if (data.code === 0) {
            const menu = data.data.items.map(item => ({
                id: item.record_id,
                name: item.fields['菜品名称'],
                price: item.fields['价格'],
                category: item.fields['分类'],
                available: item.fields['是否在售'] !== false
            })).filter(item => item.available && item.name && item.price);
            
            // 按分类分组
            const grouped = {};
            menu.forEach(item => {
                if (!grouped[item.category]) grouped[item.category] = [];
                grouped[item.category].push(item);
            });
            
            res.json({ success: true, data: grouped });
        } else {
            console.error('菜单 API 错误:', data);
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        console.error('菜单错误:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 获取订单
app.get('/api/orders', async (req, res) => {
    try {
        const token = await getAccessToken();
        const fetchRes = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await fetchRes.json();
        
        if (data.code === 0) {
            const orders = data.data.items.map(item => ({
                orderNumber: item.fields['订单号'],
                items: parseItems(item.fields['菜品详情']),
                total: item.fields['总金额'],
                time: item.fields['下单时间'],
                status: item.fields['支付状态']
            })).sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
            
            res.json({ success: true, orders });
        } else {
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 解析菜品详情
function parseItems(detail) {
    if (!detail) return [];
    try {
        return detail.split(',').map(item => {
            const match = item.match(/(.+?)\s*x(\d+)/);
            if (match) {
                return { name: match[1].trim(), quantity: parseInt(match[2]) };
            }
            return { name: item.trim(), quantity: 1 };
        });
    } catch {
        return [];
    }
}

// 创建订单
app.post('/api/order', async (req, res) => {
    try {
        const { items, total } = req.body;
        const token = await getAccessToken();
        
        const orderNumber = 'ORD' + Date.now();
        const itemDetail = items.map(i => `${i.name} x${i.quantity}`).join(', ');
        const timestamp = Date.now();
        
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
                        '下单时间': timestamp,
                        '支付状态': '已支付'
                    }
                })
            }
        );
        
        const data = await fetchRes.json();
        if (data.code === 0) {
            res.json({ success: true, orderNumber });
        } else {
            console.error('创建订单错误:', data);
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        console.error('订单错误:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 更新订单状态
app.put('/api/order/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { status } = req.body;
        const token = await getAccessToken();
        
        // 先获取订单记录 ID
        const fetchRes = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await fetchRes.json();
        
        if (data.code === 0) {
            const order = data.data.items.find(item => item.fields['订单号'] === orderNumber);
            if (order) {
                const updateRes = await fetch(
                    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records/${order.record_id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fields: {
                                '支付状态': status
                            }
                        })
                    }
                );
                const updateData = await updateRes.json();
                if (updateData.code === 0) {
                    res.json({ success: true });
                } else {
                    res.json({ success: false, error: updateData.msg });
                }
            } else {
                res.json({ success: false, error: '订单不存在' });
            }
        } else {
            res.json({ success: false, error: data.msg });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '点餐服务运行正常' });
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🍽️ 点餐服务运行在 http://localhost:${PORT}`);
    console.log(`☁️ 飞书应用：${FEISHU_CONFIG.appToken}`);
});
