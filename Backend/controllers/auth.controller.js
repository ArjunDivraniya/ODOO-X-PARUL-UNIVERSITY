const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');
const generateTokens = require('../utils/generateTokens');
const sendEmail = require('../utils/sendEmail');
const { passwordResetTemplate, emailVerificationTemplate } = require('../utils/emailTemplates');
const { uploadToCloudinary } = require('../utils/cloudinary');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_traveloop';

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, city, country, additionalInfo } = req.body;
    const bio = additionalInfo;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'traveloop/profiles');
      profileImage = result.secure_url;
    }

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        city,
        country,
        bio,
        profileImage,
        verificationToken,
        verificationTokenExpiry
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token to user
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Send Verification Email
    const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Traveloop - Verify your email address',
      html: emailVerificationTemplate(verifyLink)
    });

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token to user
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastLogin: new Date() }
    });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        isVerified: true,
        role: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token required' });
    }

    // Verify token structure
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    // Check if user and token exist in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return true anyway to prevent email enumeration attacks
      return res.json({ success: true, message: 'If that email exists, a password reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry
      }
    });

    const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Traveloop - Password Reset Request',
      html: passwordResetTemplate(resetLink)
    });

    res.json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide token and new password' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null
      }
    });

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Verification token required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'User is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry
      }
    });

    const verifyLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Traveloop - Verify your email address',
      html: emailVerificationTemplate(verifyLink)
    });

    res.json({
      success: true,
      message: 'Verification email sent'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
