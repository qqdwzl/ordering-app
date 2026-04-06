const fetch = require('node-fetch');

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
            tokenExpiry = Date.now() + (data.expire - 100) * 1000;
            return accessToken;
        }
        throw new Error('获取飞书 token 失败：' + data.msg);
    } catch (err) {
        console.error('Token 错误:', err);
        throw err;
    }
}

// Vercel Serverless Function 入口
module.exports = async (req, res) => {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const token = await getAccessToken();
        const { method, url } = req;
        const path = url.replace('/api/', '');

        // 获取菜单
        if (method === 'GET' && path === 'menu') {
            const fetchRes = await fetch(
                `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.menuAppToken}/tables/${FEISHU_CONFIG.menuTableId}/records`,
                { headers: { 'Authorization': `Bearer ${token}` } }
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
                
                const grouped = {};
                menu.forEach(item => {
                    if (!grouped[item.category]) grouped[item.category] = [];
                    grouped[item.category].push(item);
                });
                
                return res.status(200).json({ success: true, data: grouped });
            } else {
                return res.status(500).json({ success: false, error: data.msg });
            }
        }

        // 获取订单
        if (method === 'GET' && path === 'orders') {
            const fetchRes = await fetch(
                `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records`,
                { headers: { 'Authorization': `Bearer ${token}` } }
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
                
                return res.status(200).json({ success: true, orders });
            } else {
                return res.status(500).json({ success: false, error: data.msg });
            }
        }

        // 创建订单
        if (method === 'POST' && path === 'order') {
            const { items, total } = req.body;
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
                return res.status(200).json({ success: true, orderNumber });
            } else {
                console.error('创建订单错误:', data);
                return res.status(500).json({ success: false, error: data.msg });
            }
        }

        // 更新订单状态
        if (method === 'PUT' && path.match(/^order\/[^/]+$/)) {
            const orderNumber = path.split('/')[1];
            const { status } = req.body;
            
            // 先获取订单记录 ID
            const fetchRes = await fetch(
                `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.orderAppToken}/tables/${FEISHU_CONFIG.orderTableId}/records`,
                { headers: { 'Authorization': `Bearer ${token}` } }
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
                            body: JSON.stringify({ fields: { '支付状态': status } })
                        }
                    );
                    const updateData = await updateRes.json();
                    if (updateData.code === 0) {
                        return res.status(200).json({ success: true });
                    } else {
                        return res.status(500).json({ success: false, error: updateData.msg });
                    }
                } else {
                    return res.status(404).json({ success: false, error: '订单不存在' });
                }
            } else {
                return res.status(500).json({ success: false, error: data.msg });
            }
        }

        // 健康检查
        if (method === 'GET' && path === 'health') {
            return res.status(200).json({ success: true, message: '点餐服务运行正常' });
        }

        return res.status(404).json({ success: false, error: '接口不存在' });

    } catch (err) {
        console.error('API 错误:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

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
