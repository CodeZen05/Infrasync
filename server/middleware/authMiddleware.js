import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../utils/db.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    // Try finding user in database
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (dbErr) {
      console.error('Database lookup failed in auth middleware:', dbErr.message);
    }

    // If user not found in database or DB query failed, fallback to decoded token payload if valid
    if (!user) {
      if (decoded.email && decoded.role) {
        user = {
          id: decoded.userId,
          name: decoded.name || 'InfraSync User',
          email: decoded.email,
          role: decoded.role,
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'User account not found or session revoked.',
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication verification.',
    });
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role. Your role is ${req.user.role}.`,
      });
    }

    next();
  };
}

// Aliases for clean multi-format import compatibility
export const requireAuth = authenticate;
export const requireRole = (roles) => Array.isArray(roles) ? authorizeRoles(...roles) : authorizeRoles(roles);

