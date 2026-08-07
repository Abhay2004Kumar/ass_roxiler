'use strict';

const UserModel = require('../models/user.model');
const { hashPassword, comparePasswords } = require('../utils/bcrypt.util');
const { signToken } = require('../utils/jwt.util');
const ApiError = require('../utils/ApiError');

/**
 * Register a new normal user.
 *
 * @param {{ name, email, password, address }} dto
 * @returns {{ user: object, token: string }}
 */
async function register(dto) {
  const existing = await UserModel.findByEmail(dto.email);
  if (existing) throw ApiError.conflict('An account with that email already exists');

  const hashedPassword = await hashPassword(dto.password);

  const user = await UserModel.create({
    name: dto.name,
    email: dto.email,
    hashedPassword,
    address: dto.address,
    role: 'user',
  });

  return { user, token: _issueToken(user) };
}

/**
 * Authenticate any user (all roles share one login endpoint).
 * Uses a constant-time comparison path even when the user doesn't exist
 * to avoid email enumeration via timing attacks.
 *
 * @param {{ email, password }} dto
 * @returns {{ user: object, token: string }}
 */
async function login(dto) {
  const user = await UserModel.findByEmail(dto.email);

  // Always run bcrypt.compare so response time doesn't reveal whether
  // the email exists in the DB.
  const DUMMY_HASH = '$2a$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const passwordMatch = user
    ? await comparePasswords(dto.password, user.password)
    : (await comparePasswords(dto.password, DUMMY_HASH), false);

  if (!user || !passwordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Strip the password hash from the response
  const { password: _omit, ...safeUser } = user;
  return { user: safeUser, token: _issueToken(user) };
}

/**
 * Change a user's password after verifying the current one.
 *
 * @param {string} userId
 * @param {{ currentPassword, newPassword }} dto
 */
async function changePassword(userId, { currentPassword, newPassword }) {
  // findByEmail via findById gives us the hashed password (findById strips it)
  const userWithPassword = await UserModel.findByEmail(
    (await UserModel.findById(userId)).email,
  );

  const match = await comparePasswords(currentPassword, userWithPassword.password);
  if (!match) throw ApiError.badRequest('Current password is incorrect');

  if (currentPassword === newPassword) {
    throw ApiError.badRequest('New password must be different from the current one');
  }

  const hashed = await hashPassword(newPassword);
  return UserModel.updatePassword(userId, hashed);
}

// ── Private helpers ───────────────────────────────────────────────────────────

function _issueToken(user) {
  return signToken({ sub: user.id, role: user.role });
}

module.exports = { register, login, changePassword };
