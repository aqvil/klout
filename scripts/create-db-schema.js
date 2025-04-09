const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Script to create all tables from schema.ts using direct SQL

console.log('Creating database schema...');

// Create SQL statements for each table
const createUsersSql = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);`;

const createPlayersSql = `
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  club TEXT NOT NULL,
  country TEXT NOT NULL,
  position TEXT NOT NULL,
  profile_img TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  instagram_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);`;

const createPlayerStatsSql = `
CREATE TABLE IF NOT EXISTS player_stats (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  yellow_cards INTEGER NOT NULL DEFAULT 0,
  red_cards INTEGER NOT NULL DEFAULT 0,
  instagram_followers INTEGER NOT NULL DEFAULT 0,
  facebook_followers INTEGER NOT NULL DEFAULT 0,
  twitter_followers INTEGER NOT NULL DEFAULT 0,
  fan_engagement REAL NOT NULL DEFAULT 0
);`;

const createScoresSql = `
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  social_score INTEGER NOT NULL,
  performance_score INTEGER NOT NULL,
  engagement_score INTEGER NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW()
);`;

const createSettingsSql = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL
);`;

// Write SQL to a temporary file
const sqlFilePath = path.join(__dirname, 'schema.sql');
const sql = [
  createUsersSql, 
  createPlayersSql, 
  createPlayerStatsSql, 
  createScoresSql, 
  createSettingsSql
].join('\n\n');

fs.writeFileSync(sqlFilePath, sql);

try {
  // Execute the SQL using the DATABASE_URL environment variable
  console.log('Executing SQL to create tables...');
  execSync(`psql $DATABASE_URL -f ${sqlFilePath}`, { stdio: 'inherit' });
  console.log('Database schema created successfully!');
} catch (error) {
  console.error('Error creating database schema:', error.message);
  process.exit(1);
} finally {
  // Clean up
  fs.unlinkSync(sqlFilePath);
}

// Create admin user
const createAdminSql = `
INSERT INTO users (username, password, is_admin)
VALUES ('admin', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;
`;

const adminSqlPath = path.join(__dirname, 'admin.sql');
fs.writeFileSync(adminSqlPath, createAdminSql);

try {
  console.log('Creating admin user...');
  execSync(`psql $DATABASE_URL -f ${adminSqlPath}`, { stdio: 'inherit' });
  console.log('Admin user created with username: admin, password: admin123');
} catch (error) {
  console.error('Error creating admin user:', error.message);
} finally {
  fs.unlinkSync(adminSqlPath);
}