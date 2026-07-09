import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      res.status(200).json(config);
    } else {
      res.status(404).json({ error: 'Firebase config file not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
