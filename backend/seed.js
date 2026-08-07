'use strict';

/**
 * seed.js — Bootstrap the platform with an initial admin account.
 *
 * Run:  npm run seed
 *
 * Idempotent: if the admin email already exists the script exits cleanly.
 * This means it's safe to run multiple times without duplicating data.
 */

require('dotenv').config();

const { hashPassword }  = require('./src/utils/bcrypt.util');
const { query, pool }   = require('./src/config/db');

// ── Seed data ────────────────────────────────────────────────────────────────

const ADMIN = {
  name:     'System Administrator Account',   // 25 chars (satisfies min-20)
  email:    'admin@storerating.dev',
  password: 'Admin@1234',                     // meets: 8-16, uppercase, special char
  address:  '123 Admin Blvd, Platform HQ, Tech City, 10001',
  role:     'admin',
};

// ── Runner ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  Running database seed…\n');

  try {
    // Check idempotency
    const { rows } = await query(
      'SELECT id FROM users WHERE email = $1',
      [ADMIN.email],
    );

    if (rows.length > 0) {
      console.log('ℹ️   Admin user already exists — skipping.\n');
      return;
    }

    const hashed = await hashPassword(ADMIN.password);

    await query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES             ($1,   $2,    $3,       $4,      $5)`,
      [ADMIN.name, ADMIN.email, hashed, ADMIN.address, ADMIN.role],
    );

    console.log('✅  Admin account created successfully!\n');
    console.log('   ┌──────────────────────────────────────────┐');
    console.log(`   │  Email    : ${ADMIN.email.padEnd(29)}│`);
    console.log(`   │  Password : ${ADMIN.password.padEnd(29)}│`);
    console.log('   └──────────────────────────────────────────┘');
    console.log('\n   ⚠️   Change this password immediately after first login!\n');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
