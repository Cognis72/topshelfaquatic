const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and replit domains
    const allowedOrigins = [
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      'http://0.0.0.0:5000'
    ];
    
    // Allow any replit.app domain
    if (origin.includes('.replit.app') || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    return callback(null, true); // Allow all for deployment compatibility
  },
  credentials: true
}));
app.use(express.json());

// Simple in-memory storage for now
let orders = [];
let orderIdCounter = 1;

// Fish data storage
const fs = require('fs');

// Order notification function (console logging only)
async function logNewOrder(order) {
  console.log('📱 New Order Received:');
  console.log(`🆔 Order ID: ${order.id}`);
  console.log(`👤 Customer: ${order.customerName}`);
  console.log(`📱 Phone: ${order.customerPhone}`);
  console.log(`📧 Email: ${order.customerEmail || 'ไม่ระบุ'}`);
  console.log(`🏠 Address: ${order.customerAddress}`);
  console.log(`💰 Total: ${order.totalAmount} บาท`);
  console.log(`📝 Items: ${order.orderItems.length} items`);
  console.log(`📅 Date: ${new Date().toLocaleString('th-TH')}`);
  console.log('─'.repeat(50));
}

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TopShelf Aquatic API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Server is running' });
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, orderItems, notes } = req.body;
    
    if (!customerName || !customerPhone || !customerAddress || !orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of orderItems) {
      const price = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0;
      totalAmount += price * item.quantity;
    }

    // Create order
    const order = {
      id: orderIdCounter++,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      totalAmount: totalAmount.toFixed(2),
      notes,
      status: 'pending',
      orderItems,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    // Log the new order
    await logNewOrder(order);

    console.log(`✅ New order created: #${order.id} from ${order.customerName}`);
    
    res.status(201).json({ 
      message: "Order created successfully", 
      orderId: order.id,
      status: 'success'
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  
  res.json(order);
});

// Log status update
function logStatusUpdate(order, newStatus, oldStatus) {
  console.log('📊 Order Status Update:');
  console.log(`🆔 Order ID: ${order.id}`);
  console.log(`👤 Customer: ${order.customerName}`);
  console.log(`📊 Status: ${oldStatus} → ${newStatus}`);
  console.log(`📅 Updated: ${new Date().toLocaleString('th-TH')}`);
  console.log('─'.repeat(50));
}

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = orders[orderIndex].status;
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Log status update
    logStatusUpdate(orders[orderIndex], status, oldStatus);
    
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// Fish management endpoints
app.get('/api/fish', async (req, res) => {
  try {
    const fishDataPath = path.join(__dirname, '..', 'fish-data.json');
    const fishData = JSON.parse(fs.readFileSync(fishDataPath, 'utf8'));
    res.json(fishData);
  } catch (error) {
    console.error('Error reading fish data:', error);
    res.status(500).json({ message: 'Failed to load fish data' });
  }
});

app.post('/api/fish', async (req, res) => {
  try {
    const fishDataPath = path.join(__dirname, '..', 'fish-data.json');
    const newFishData = req.body;
    
    // Write updated fish data to file
    fs.writeFileSync(fishDataPath, JSON.stringify(newFishData, null, 2), 'utf8');
    
    console.log(`📋 Fish data updated: ${newFishData.length} fish in catalog`);
    res.json({ message: 'Fish data updated successfully', count: newFishData.length });
  } catch (error) {
    console.error('Error updating fish data:', error);
    res.status(500).json({ message: 'Failed to update fish data' });
  }
});

app.delete('/api/fish/:id', async (req, res) => {
  try {
    const fishId = parseInt(req.params.id);
    const fishDataPath = path.join(__dirname, '..', 'fish-data.json');
    const fishData = JSON.parse(fs.readFileSync(fishDataPath, 'utf8'));
    
    const updatedFishData = fishData.filter(fish => fish.id !== fishId);
    fs.writeFileSync(fishDataPath, JSON.stringify(updatedFishData, null, 2), 'utf8');
    
    console.log(`🗑️ Fish #${fishId} deleted from catalog`);
    res.json({ message: 'Fish deleted successfully' });
  } catch (error) {
    console.error('Error deleting fish:', error);
    res.status(500).json({ message: 'Failed to delete fish' });
  }
});

// Serve static files (after API routes)
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST /api/orders - Create new order`);
  console.log(`   GET  /api/orders - List all orders`);
  console.log(`   GET  /api/orders/:id - Get specific order`);
  console.log(`   PATCH /api/orders/:id/status - Update order status`);
  console.log(`   GET  /api/fish - List all fish`);
  console.log(`   POST /api/fish - Update fish catalog`);
  console.log(`   DELETE /api/fish/:id - Delete specific fish`);
  console.log('🔄 Ready to receive orders and manage fish!');
});