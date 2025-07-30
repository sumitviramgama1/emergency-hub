const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Request = require("../models/Request");

const sendRequest = async (req, res) => {
  const { userId, serviceProviderPhone } = req.body;

  try {
    const user = await User.findById(userId);
    const serviceProvider = await ServiceProvider.findOne({
      phoneNumber: serviceProviderPhone,
    });

    if (!user || !serviceProvider) {
      return res
        .status(404)
        .json({ message: "User or Service Provider not found" });
    }

    const request = new Request({
      userId: user._id,
      serviceProviderId: serviceProvider._id,
    });

    await request.save();

    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error sending request", error });
  }
};

// Function to accept a request
const acceptRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request", error });
  }
};

// Function to reject a request
const rejectRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error });
  }
};

// authController.js
const registerUser = async (req, res) => {
  console.log("Register request body:", req.body);
  const { username, password, phoneNumber } = req.body;

  try {
    const user = new User({ username, password, phoneNumber });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        error: `${field} already exists`,
      });
    }

    res.status(400).send({
      error: "Registration failed",
      details: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.send({ token, userId: user._id });
  } catch (error) {
    res.status(500).send({ error: "Login failed" });
  }
};

const registerServiceProvider = async (req, res) => {
  const { username, password, serviceType, phoneNumber } = req.body; // Add phoneNumber
  try {
    const serviceProvider = new ServiceProvider({
      username,
      password,
      serviceType,
      phoneNumber,
    }); // Include phoneNumber
    await serviceProvider.save();
    res
      .status(201)
      .send({ message: "Service Provider registered successfully" });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Registration failed", details: error.message });
  }
};

const loginServiceProvider = async (req, res) => {
  const { username, password } = req.body;
  try {
    const serviceProvider = await ServiceProvider.findOne({ username });
    if (!serviceProvider) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, serviceProvider.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: serviceProvider._id }, "secretkey", {
      expiresIn: "1h",
    });
    // console.log(serviceProvider._id);
    res.send({ token, userId: serviceProvider._id });
  } catch (error) {
    res.status(500).send({ error: "Login failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerServiceProvider,
  loginServiceProvider,
  sendRequest,
  acceptRequest,
  rejectRequest,
};
