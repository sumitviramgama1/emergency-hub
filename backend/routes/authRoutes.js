const express = require("express");
const {
  registerUser,
  loginUser,
  registerServiceProvider,
  loginServiceProvider,
  sendRequest,
  acceptRequest,
  rejectRequest,
} = require("../controllers/authController");
const Request = require("../models/Request");
const cors = require("cors");

const router = express.Router();
const corsOptions = {
  origin: ["https://emergency-hub-kxyn.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
router.get("/requests", cors(corsOptions), async (req, res) => {
  const { serviceProviderId } = req.query;
  //  console.log(serviceProviderId);
  try {
    const requests = await Request.find({ serviceProviderId });
    // console.log(requests);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

router.get("/srequests", cors(corsOptions), async (req, res) => {
  const { userId } = req.query;
  try {
    const requests = await Request.find({ userId });
    if (requests.length > 0 && requests[0].status === "accepted") {
      await Request.findByIdAndDelete(requests[0]._id);

      res.status(200).json({ message: "Request accepted" });
    } else if (requests.length > 0 && requests[0].status === "rejected") {
      await Request.findByIdAndDelete(requests[0]._id);

      res.status(200).json({ message: "Request rejected" });
    } else if (requests.length > 0 && requests[0].status === "pending") {
      res.status(200).json({ message: "Request pending" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

router.post("/register/user", cors(corsOptions), registerUser);
router.post("/login/user", cors(corsOptions), loginUser);
router.post(
  "/register/service-provider",
  cors(corsOptions),
  registerServiceProvider
);
router.post("/login/service-provider", cors(corsOptions), loginServiceProvider);
router.post("/request/send", cors(corsOptions), sendRequest);
router.post("/request/accept", cors(corsOptions), acceptRequest);
router.post("/request/reject", cors(corsOptions), rejectRequest);

module.exports = router;
