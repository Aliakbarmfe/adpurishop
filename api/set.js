// api/set.js

const firebaseConfig = {
  apiKey: "AIzaSyDMubV7tJJsO1jYJzD0VolQlS37DwrE6S8",
  authDomain: "freedom-mfe.firebaseapp.com",
  databaseURL: "https://freedom-mfe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "freedom-mfe",
  storageBucket: "freedom-mfe.firebasestorage.app",
  messagingSenderId: "845855958915",
  appId: "1:845855958915:web:8013a60a9c9ea502fa78b6",
  measurementId: "G-XR3DWXTLYX"
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseURL = firebaseConfig.databaseURL;

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${databaseURL}/settings.json`);
      const data = await response.json();
      return res.status(200).json(data || {});
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = req.body || {};
      
      const getRes = await fetch(`${databaseURL}/settings.json`);
      const currentSettings = await getRes.json() || {};

      let updatedSettings = { ...currentSettings };

      if ('key' in body && 'value' in body) {
        updatedSettings[body.key] = body.value;
      } else {
        updatedSettings = { ...updatedSettings, ...body };
      }

      const putRes = await fetch(`${databaseURL}/settings.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      const result = await putRes.json();
      return res.status(200).json({ success: true, data: result });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
