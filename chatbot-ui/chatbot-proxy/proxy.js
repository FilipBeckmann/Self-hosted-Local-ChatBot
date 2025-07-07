const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.post('/api/generate', async (req, res) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).send(errText);
    }

    let result = '';
    let buffer = '';

    response.body.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      let lines = buffer.split('\n');
      buffer = lines.pop(); // letzte Zeile evtl. unvollständig

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.response) result += obj.response;
          if (obj.done) {
            // Sende Antwort und beende
            res.json({ response: result });
            response.body.destroy(); // Stream beenden
          }
        } catch (e) {
          console.error('Fehler beim Parsen von JSON-Zeile:', line);
        }
      }
    });

    response.body.on('end', () => {
      // Falls done nicht kam, trotzdem antworten
      if (!res.headersSent) {
        res.json({ response: result });
      }
    });

    response.body.on('error', (err) => {
      console.error('Stream Fehler:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => {
  console.log('Proxy läuft auf Port 8000');
});
