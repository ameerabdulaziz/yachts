const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const sql = neon(process.env.DATABASE_URL);

// Test yacht endpoint
app.get('/api/yachts', async (req, res) => {
  try {
    const yachts = await sql`SELECT * FROM yachts WHERE is_active = true ORDER BY created_at DESC`;
    res.json(yachts);
  } catch (error) {
    console.error('Yachts API error:', error);
    res.status(500).json({ message: 'Failed to fetch yachts', error: error.message });
  }
});

// Test yacht details endpoint  
app.get('/api/yachts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const yacht = await sql`SELECT * FROM yachts WHERE id = ${id}`;
    
    if (yacht.length === 0) {
      return res.status(404).json({ message: 'Yacht not found' });
    }
    
    res.json(yacht[0]);
  } catch (error) {
    console.error('Yacht details API error:', error);
    res.status(500).json({ message: 'Failed to fetch yacht details', error: error.message });
  }
});

// Test ownership opportunities endpoint (this was returning 500)
app.get('/api/ownership-opportunities', async (req, res) => {
  try {
    const opportunities = await sql`
      SELECT o.*, y.name as yacht_name, y.location, y.images 
      FROM ownership_opportunities o 
      JOIN yachts y ON o.yacht_id = y.id 
      WHERE o.is_active = true AND o.available_shares > 0 
      ORDER BY o.created_at DESC
    `;
    res.json(opportunities);
  } catch (error) {
    console.error('Ownership opportunities API error:', error);
    res.status(500).json({ message: 'Failed to fetch ownership opportunities', error: error.message });
  }
});

// Test fuel wallet endpoints
app.get('/api/fuel-wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
      SELECT * FROM fuel_transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    res.json(transactions);
  } catch (error) {
    console.error('Fuel wallet API error:', error);
    res.status(500).json({ message: 'Failed to fetch fuel transactions', error: error.message });
  }
});

// Test endpoint for a specific ownership opportunity
app.get('/api/ownership/:opportunityId', async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await sql`
      SELECT o.*, y.name as yacht_name, y.description, y.location, y.images, y.amenities 
      FROM ownership_opportunities o 
      JOIN yachts y ON o.yacht_id = y.id 
      WHERE o.id = ${opportunityId}
    `;
    
    if (opportunity.length === 0) {
      return res.status(404).json({ message: 'Ownership opportunity not found' });
    }
    
    res.json(opportunity[0]);
  } catch (error) {
    console.error('Ownership details API error:', error);
    res.status(500).json({ message: 'Failed to fetch ownership details', error: error.message });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log('Test endpoints:');
  console.log(`- GET /api/yachts`);
  console.log(`- GET /api/yachts/:id`);
  console.log(`- GET /api/ownership-opportunities`);
  console.log(`- GET /api/fuel-wallet/:userId`);
  console.log(`- GET /api/ownership/:opportunityId`);
});