export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const IMGBB_API_KEY = "32b44cf4a92e03d876d7d02104feabfb";

  try {
    const { image } = req.body; // Base64 String
    if (!image) {
      return res.status(400).json({ error: 'تصویری ارسال نشده است' });
    }

    // ارسال به ImgBB
    const formData = new URLSearchParams();
    formData.append('image', image.replace(/^data:image\/\w+;base64,/, ""));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'خطا در آپلود عکس', details: error.message });
  }
}
