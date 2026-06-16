const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// Load environment variables with fallbacks
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nexus_tech',
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

const pool = new Pool(poolConfig);

// Helper to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// In-memory fallback if PG is not running/available, ensuring the app remains usable for demo/evaluation
let memoryDB = {
  inquiries: [],
  estimates: [],
  adminUsers: [
    {
      username: 'admin',
      password_hash: hashPassword('admin123'),
    }
  ]
};

let useMemoryFallback = false;

async function testConnectionAndMigrate() {
  try {
    // Try to connect to postgres
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database!');
    
    // Create tables query
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS estimates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        items_selected TEXT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `;
    
    await client.query(createTablesQuery);
    console.log('PostgreSQL database tables initialized successfully.');

    // Seed default admin user if none exists
    const adminCheck = await client.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
    if (adminCheck.rows.length === 0) {
      const defaultHash = hashPassword('admin123');
      await client.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', defaultHash]);
      console.log('Seeded default admin user with username: "admin" and password: "admin123"');
    }
    
    client.release();
  } catch (error) {
    console.error('\n================================================================');
    console.error('DATABASE WARNING: Could not connect to PostgreSQL database.');
    console.error('Connection Config attempted:', {
      host: poolConfig.host,
      user: poolConfig.user,
      database: poolConfig.database,
      port: poolConfig.port,
      password: '****'
    });
    console.error('Error Details:', error.message);
    console.error('HOW TO RESOLVE:');
    console.error('1. Make sure your PostgreSQL server is running.');
    console.error('2. Create the database named "nexus_tech" using pgAdmin or psql:');
    console.error('   CREATE DATABASE nexus_tech;');
    console.error('3. Check and update the backend/.env file with correct credentials.');
    console.error('----------------------------------------------------------------');
    console.error('FALLBACK ACTIVATED: Running in-memory mock database for now.');
    console.error('Submissions will work temporarily but will clear when the server restarts.');
    console.error('================================================================\n');
    useMemoryFallback = true;
  }
}

// Database Operations Wrapper
const db = {
  testConnectionAndMigrate,
  
  // Inquiries methods
  saveInquiry: async (name, email, phone, company, message, service_type) => {
    if (useMemoryFallback) {
      const newInquiry = {
        id: memoryDB.inquiries.length + 1,
        name,
        email,
        phone,
        company,
        message,
        service_type,
        date: new Date()
      };
      memoryDB.inquiries.push(newInquiry);
      return newInquiry;
    } else {
      const query = `
        INSERT INTO inquiries (name, email, phone, company, message, service_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [name, email, phone, company, message, service_type];
      const res = await pool.query(query, values);
      return res.rows[0];
    }
  },

  getAllInquiries: async () => {
    if (useMemoryFallback) {
      // Return sorted by date desc
      return [...memoryDB.inquiries].sort((a, b) => b.date - a.date);
    } else {
      const query = 'SELECT * FROM inquiries ORDER BY date DESC';
      const res = await pool.query(query);
      return res.rows;
    }
  },

  // Estimates methods
  saveEstimate: async (name, email, phone, items_selected, total_price) => {
    // items_selected can be an array of objects, serialize as JSON string
    const itemsStr = typeof items_selected === 'string' ? items_selected : JSON.stringify(items_selected);
    
    if (useMemoryFallback) {
      const newEstimate = {
        id: memoryDB.estimates.length + 1,
        name,
        email,
        phone,
        items_selected: itemsStr,
        total_price: parseFloat(total_price),
        date: new Date()
      };
      memoryDB.estimates.push(newEstimate);
      return newEstimate;
    } else {
      const query = `
        INSERT INTO estimates (name, email, phone, items_selected, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [name, email, phone, itemsStr, parseFloat(total_price)];
      const res = await pool.query(query, values);
      return res.rows[0];
    }
  },

  getAllEstimates: async () => {
    if (useMemoryFallback) {
      return [...memoryDB.estimates].sort((a, b) => b.date - a.date);
    } else {
      const query = 'SELECT * FROM estimates ORDER BY date DESC';
      const res = await pool.query(query);
      return res.rows;
    }
  },

  // Auth methods
  verifyAdmin: async (username, password) => {
    const hash = hashPassword(password);
    if (useMemoryFallback) {
      const admin = memoryDB.adminUsers.find(
        u => u.username === username && u.password_hash === hash
      );
      return !!admin;
    } else {
      const query = 'SELECT * FROM admin_users WHERE username = $1 AND password_hash = $2';
      const res = await pool.query(query, [username, hash]);
      return res.rows.length > 0;
    }
  }
};

module.exports = db;
