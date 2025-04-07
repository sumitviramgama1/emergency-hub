const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const cors = require("cors");
const corsOptions = {
  origin: ["https://emergency-hub-kxyn.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Get all requests for a service provider
router.get('/requests/:providerId',cors(corsOptions), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      serviceProviderId: req.params.providerId
    }).sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Handle request action (accept/reject)
router.post('/request/action',cors(corsOptions), async (req, res) => {
  try {
    const { requestId, action, serviceProviderId } = req.body;

    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.serviceProviderId !== serviceProviderId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
    } else if (action === 'reject') {
      request.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await request.save();
    res.json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request' });
  }
});

module.exports = router; 