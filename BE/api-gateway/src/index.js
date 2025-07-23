const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.url}`);
  next();
});

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8080';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8082';

// Auth endpoints
app.post('/auth/login', createProxyMiddleware({ 
  target: USER_SERVICE_URL,
  changeOrigin: true,
  timeout: 5000, // 5 seconds timeout
  proxyTimeout: 5000,
  onProxyReq: (proxyReq, req, res) => {
    console.log('[API Gateway] Forwarding login request to User Service');
    console.log('[API Gateway] Request body:', req.body);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Stringified body:', bodyData);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from User Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}));

app.post('/auth/register', createProxyMiddleware({ 
  target: USER_SERVICE_URL,
  changeOrigin: true,
  timeout: 5000, // 5 seconds timeout
  proxyTimeout: 5000,
  onProxyReq: (proxyReq, req, res) => {
    console.log('[API Gateway] Forwarding login request to User Service');
    console.log('[API Gateway] Request body:', req.body);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Stringified body:', bodyData);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from User Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}));

app.get('/auth/profile', createProxyMiddleware({ 
  target: USER_SERVICE_URL,
  changeOrigin: true 
}));

// Product endpoints
app.get('/products', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true 
}));

app.get('/products/:id', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true 
}));

app.post('/products', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  timeout: 5000, // 5 seconds timeout
  proxyTimeout: 5000,
  onProxyReq: (proxyReq, req, res) => {
    console.log('[API Gateway] Forwarding login request to User Service');
    console.log('[API Gateway] Request body:', req.body);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Stringified body:', bodyData);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from User Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}));

app.patch('/products/:id', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  timeout: 5000, // 5 seconds timeout
  proxyTimeout: 5000,
  onProxyReq: (proxyReq, req, res) => {
    console.log('[API Gateway] Forwarding login request to User Service');
    console.log('[API Gateway] Request body:', req.body);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log('[API Gateway] Stringified body:', bodyData);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from User Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}));

app.delete('/products/:id', createProxyMiddleware({ 
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true 
}));

// Order endpoints
app.get('/orders', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true 
}));

app.get('/orders/user/:userId', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true 
}));

app.get('/orders/:id', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true 
}));

app.post('/orders', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  timeout: 5000, // increase to 30 seconds
  proxyTimeout: 5000,
  onProxyReq: (proxyReq, req, res) => {
    console.log('[API Gateway] Forwarding order request to Order Service');
    console.log('[API Gateway] Order data:', req.body);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from Order Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Order proxy error:', err);
    res.status(504).json({ 
      message: 'Order Service Timeout', 
      error: err.message,
      details: 'The order service took too long to respond. Please try again.'
    });
  }
}));

app.patch('/orders/:id', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true 
}));

app.delete('/orders/:id', createProxyMiddleware({ 
  target: ORDER_SERVICE_URL,
  changeOrigin: true 
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
}); 