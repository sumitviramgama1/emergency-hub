const express = require('express');
const { 
  registerUser, 
  loginUser, 
  registerServiceProvider, 
  loginServiceProvider,
  sendRequest,
  acceptRequest,
  rejectRequest
} = require('../controllers/authController');
const Request = require('../models/Request');

const router = express.Router();
router.get('/requests', async (req, res) => {
  const { serviceProviderId } = req.query;
//  console.log(serviceProviderId);
  try {
    const requests = await Request.find({ serviceProviderId });
    // console.log(requests);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

router.get('/srequests', async (req, res) => {
  const { userId } = req.query;
  try {
    const requests = await Request.find({ userId });
    if (requests.length > 0 && requests[0].status === 'accepted') {
      await Request.findByIdAndDelete(requests[0]._id);

      res.status(200).json({ message: 'Request accepted' });
    } else if (requests.length > 0 && requests[0].status === 'rejected') {
      await Request.findByIdAndDelete(requests[0]._id);

      res.status(200).json({ message: 'Request rejected' });
    }else if (requests.length > 0 && requests[0].status === 'pending') {
      res.status(200).json({ message: 'Request pending' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

router.post('/register/user', registerUser);
router.post('/login/user', loginUser);
router.post('/register/service-provider', registerServiceProvider);
router.post('/login/service-provider', loginServiceProvider);
router.post('/request/send', sendRequest);
router.post('/request/accept', acceptRequest);
router.post('/request/reject', rejectRequest);

module.exports = router;