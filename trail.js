'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Adjust the path as needed

class Address extends Model {}

Address.init({
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // This should match the name of the user table
      key: 'id'
    },
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Address',
  tableName: 'Addresses',
  timestamps: true
});

module.exports = Address;


const Address = require('../db/models/address_table'); // Adjust path as needed

const CreateAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country } = req.body;
    const userId = req.userId; // Assuming userId is added to req by authentication middleware

    if (!street || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const newAddress = await Address.create({
      street,
      city,
      state,
      postalCode,
      country,
      userId
    });

    res.status(201).json({
      message: 'Address created successfully',
      address: newAddress
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error.message}`
    });
  }
};

const GetAddressesByUser = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is added to req by authentication middleware

    const addresses = await Address.findAll({
      where: { userId }
    });

    res.status(200).json({
      message: 'Addresses retrieved successfully',
      addresses
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error.message}`
    });
  }
};

module.exports = { CreateAddress, GetAddressesByUser };


const express = require('express');
const router = express.Router();
const { CreateAddress, GetAddressesByUser } = require('../controllers/address_controller');
const authMiddleware = require('../middlewares/auth_middleware'); // Assuming you have an authentication middleware

// Create an address
router.post('/create', authMiddleware, CreateAddress);

// Get addresses by user
router.get('/user-addresses', authMiddleware, GetAddressesByUser);

module.exports = router;






const jwt = require('jsonwebtoken');
const User = require('../db/models/user_table'); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error.message}`
    });
  }
};

module.exports = authMiddleware;









const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/models/user_table'); // Adjust path as necessary

// Signup Controller
const Signup = async (req, res) => {
  try {
    const { firstname, lastname, email, phonenumber, password, userType } = req.body;

    if (!firstname || !lastname || !email || !phonenumber || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      phonenumber,
      password: hashedPassword,
      userType: userType || '0'
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Login Controller
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Profile Controller
const Profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId); // Get user ID from request object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: 'User profile retrieved successfully', user });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

module.exports = { Signup, Login, Profile };







const express = require('express');
const { Signup, Login, Profile } = require('../controllers/authControllers');
const authMiddleware = require('../middlewares/auth_middleware'); // Import the authentication middleware

const router = express.Router();

// Route for user registration
router.post('/signup', Signup);

// Route for user login
router.post('/login', Login);

// Route for fetching user profile, requires authentication
router.get('/profile', authMiddleware, Profile);

module.exports = router;