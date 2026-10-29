import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ck44_super_jwt_secret_token_bangla_2026');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }

      // Demo & Admin fallback
      if (decoded.id === '660000000000000000000001') {
        req.user = {
          _id: '660000000000000000000001',
          username: 'demo',
          role: 'player',
          mobile: '01711223344',
          vipLevel: 3,
          affiliateCode: 'CK44DEMO',
          status: 'ACTIVE',
        };
        return next();
      }

      if (decoded.id === '660000000000000000000002') {
        req.user = {
          _id: '660000000000000000000002',
          username: 'kabir@gmail.com',
          email: 'kabir@gmail.com',
          role: 'admin',
          mobile: '01800000000',
          vipLevel: 5,
          affiliateCode: 'CK44ADMIN',
          status: 'ACTIVE',
        };
        return next();
      }

      return res.status(401).json({ success: false, message: 'User not found' });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ck44_super_jwt_secret_token_bangla_2026');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token failure in optionalAuth
    }
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.username === 'kabir@gmail.com' ||
      req.user.email === 'kabir@gmail.com')
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'অ্যাক্সেস ডিনাইড! এই সেকশনে প্রবেশের জন্য অ্যাডমিন পারমিশন প্রয়োজন।',
  });
};
