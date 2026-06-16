const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Console logging for debugging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Secret token for admin API security simulation
const ADMIN_TOKEN = 'nexus-admin-token-secret-9988';

// Middleware for admin verification
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Invalid authentication token.' });
  }
  
  next();
}

// API Routes

// 1. Submit a Contact Inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, company, message, service_type } = req.body;
  
  if (!name || !email || !message || !service_type) {
    return res.status(400).json({ error: 'Name, email, message, and service type are required fields.' });
  }
  
  try {
    const inquiry = await db.saveInquiry(name, email, phone || '', company || '', message, service_type);
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ error: 'Server error. Failed to save inquiry.' });
  }
});

// 2. Submit a Cost Estimate
app.post('/api/estimates', async (req, res) => {
  const { name, email, phone, items_selected, total_price } = req.body;
  
  if (!name || !email || !items_selected || total_price === undefined) {
    return res.status(400).json({ error: 'Name, email, selected items, and total price are required.' });
  }
  
  try {
    const estimate = await db.saveEstimate(name, email, phone || '', items_selected, total_price);
    res.status(201).json({ success: true, estimate });
  } catch (error) {
    console.error('Error saving estimate:', error);
    res.status(500).json({ error: 'Server error. Failed to save estimate.' });
  }
});

// 3. Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  
  try {
    const isValid = await db.verifyAdmin(username, password);
    if (isValid) {
      res.json({ success: true, token: ADMIN_TOKEN, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error on admin login:', error);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
});

// 4. Retrieve all Inquiries (Admin Only)
app.get('/api/admin/inquiries', verifyAdminToken, async (req, res) => {
  try {
    const inquiries = await db.getAllInquiries();
    res.json({ success: true, inquiries });
  } catch (error) {
    console.error('Error getting inquiries:', error);
    res.status(500).json({ error: 'Server error. Failed to retrieve inquiries.' });
  }
});

// 5. Retrieve all Estimates (Admin Only)
app.get('/api/admin/estimates', verifyAdminToken, async (req, res) => {
  try {
    const estimates = await db.getAllEstimates();
    res.json({ success: true, estimates });
  } catch (error) {
    console.error('Error getting estimates:', error);
    res.status(500).json({ error: 'Server error. Failed to retrieve estimates.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Bootstrap server
async function startServer() {
  // Test connection & run migrations
  await db.testConnectionAndMigrate();
  
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
