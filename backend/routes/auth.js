const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// SIGNUP - create a new account
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN - verify credentials
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare entered password with the encrypted one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;