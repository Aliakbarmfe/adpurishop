export default async function handler(req, res) {
  // تنظیم CORS برای دسترسی بدون مشکل
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path = '' } = req.query;
  const DB_URL = "https://freedom-mfe-default-rtdb.asia-southeast1.firebasedatabase.app";
  
  // مسیر هدف در فایربیس
  const targetUrl = `${DB_URL}/${path}.json`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'خطا در ارتباط با دیتابیس', details: error.message });
  }
}
