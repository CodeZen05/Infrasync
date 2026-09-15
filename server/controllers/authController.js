import { prisma } from '../utils/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// In-memory demo fallback store if PostgreSQL is temporarily unavailable/unseeded
const fallbackUsers = new Map();

// Initialize fallback store with hashed demo users
async function initFallbackUsers() {
  if (fallbackUsers.size === 0) {
    const defaultHash = await hashPassword('password123');
    fallbackUsers.set('pm@infrasync.demo', {
      id: 'demo-pm-uuid-001',
      name: 'Demo Project Manager',
      email: 'pm@infrasync.demo',
      passwordHash: defaultHash,
      role: 'PROJECT_MANAGER',
      createdAt: new Date().toISOString(),
    });
    fallbackUsers.set('se@infrasync.demo', {
      id: 'demo-se-uuid-002',
      name: 'Demo Site Engineer',
      email: 'se@infrasync.demo',
      passwordHash: defaultHash,
      role: 'SITE_ENGINEER',
      createdAt: new Date().toISOString(),
    });
  }
}
initFallbackUsers();

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    let existingUser = null;
    let dbAvailable = true;

    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn('PostgreSQL query notice (register): falling back to in-memory store:', dbErr.message);
      dbAvailable = false;
      existingUser = fallbackUsers.get(email);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this work email already exists. Please log in.',
        errors: { email: 'Email is already registered.' },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    let newUser = null;

    if (dbAvailable) {
      try {
        newUser = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            role,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });
      } catch (insertErr) {
        console.warn('PostgreSQL insert notice: fallback store utilized:', insertErr.message);
        dbAvailable = false;
      }
    }

    if (!newUser) {
      const fallbackId = `user-${Date.now()}`;
      const record = {
        id: fallbackId,
        name,
        email,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
      };
      fallbackUsers.set(email, record);
      newUser = {
        id: record.id,
        name: record.name,
        email: record.email,
        role: record.role,
        createdAt: record.createdAt,
      };
    }

    // Generate JWT token (Never include password or passwordHash)
    const token = generateToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
      name: newUser.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during account registration. Please try again.',
    });
  }
}

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    let user = null;
    let dbAvailable = true;

    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn('PostgreSQL query notice (login): checking fallback store:', dbErr.message);
      dbAvailable = false;
      user = fallbackUsers.get(email);
    }

    // Also check fallback store if not found in DB (e.g. if freshly seeded in-memory)
    if (!user && fallbackUsers.has(email)) {
      user = fallbackUsers.get(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        errors: { general: 'Invalid credentials. Please verify your email and password.' },
      });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        errors: { general: 'Invalid credentials. Please verify your email and password.' },
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    // Safe user object (NEVER return passwordHash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred during login. Please try again.',
    });
  }
}

/**
 * Get currently authenticated user profile
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
}

/**
 * Log out user
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}
