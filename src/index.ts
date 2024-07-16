import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';

interface BackendConfig {
  route: string;
  target: string;
}

// Define the configuration interface
interface Config {
  port: number;
  backends: BackendConfig[];
}

// Load configuration file
const configPath = path.resolve(__dirname, 'config', 'config.json');
const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const app = express();

app.use((req: Request, _: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

config.backends.forEach((backend) => {
  app.use(
    backend.route,
    createProxyMiddleware({
      target: backend.target,
      changeOrigin: true,
      pathRewrite: {
        [`^${backend.route}`]: '', // Remove the route prefix when forwarding to target
      },
    })
  )
});

const port = config.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);