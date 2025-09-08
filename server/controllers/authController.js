import User from '../models/User.js';
import { sendTokenResponse, getGoogleOAuthURL } from '../utils/authUtils.js';
import { UnauthenticatedError, BadRequestError, ConflictError } from '../utils/errors.js';
import axios from 'axios';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: (await User.countDocuments({})) === 0 ? 'admin' : 'user' // First user is admin
    });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new BadRequestError('Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'favorites',
        populate: [
          { path: 'song', model: 'Song' },
          { path: 'quote', model: 'Quote' }
        ]
      });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get Google OAuth URL
// @route   GET /api/auth/google/url
// @access  Public
export const getGoogleAuthUrl = (req, res) => {
  const url = getGoogleOAuthURL();
  res.status(200).json({ url });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw new BadRequestError('Authorization code not provided');
    }

    // Exchange code for tokens
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    // Get user info
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Find or create user
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      // Create new user
      user = await User.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.id,
        isEmailVerified: true
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isEmailVerified = true;
      await user.save();
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
