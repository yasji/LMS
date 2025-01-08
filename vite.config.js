import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  plugins: [{
    name: 'file-persistence',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', async () => {
            try {
              const { filename, data } = JSON.parse(body);
              const filePath = `src/data/${filename}`;
              await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error('Error saving file:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save file' }));
            }
          });
        } else {
          next();
        }
      });
    }
  }]
});