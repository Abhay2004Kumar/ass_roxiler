'use strict';

const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n env Missing required environment variables:');
    missing.forEach((key) => console.error(`        - ${key}`));
    console.error('\n  Copy .env.example → .env and fill in the values.\n');
    process.exit(1);
  }
}

module.exports = { validateEnv };
