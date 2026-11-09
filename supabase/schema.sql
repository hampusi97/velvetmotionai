-- ==============================================================================
-- VelvetMotion AI - Supabase / PostgreSQL Production Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                             -- User session ID or Wallet Address
    wallet_address TEXT,                             -- User's personal Bitcoin / Web3 address
    is_vip BOOLEAN DEFAULT FALSE,                    -- VIP Diamond membership status
    referral_code TEXT UNIQUE NOT NULL,              -- Unique affiliate referral code
    referred_by TEXT,                                -- Referrer's code if invited
    btc_balance NUMERIC(16, 8) DEFAULT 0.00000000,   -- Accumulated 30% affiliate earnings
    usd_balance NUMERIC(10, 2) DEFAULT 0.00,         -- Equivalent USD affiliate balance
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index for instant referral code lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- 3. Conversations Table (Persistent Chat Memory)
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    companion_id TEXT NOT NULL,                      -- e.g. 'chloe', 'asuka', 'sienna', 'elena'
    sender TEXT NOT NULL,                            -- 'user' | companion name
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index for retrieving conversation history quickly
CREATE INDEX IF NOT EXISTS idx_conversations_user_companion ON conversations(user_id, companion_id, timestamp ASC);

-- 4. Vault Unlocks Table (Exclusive 4K Photos)
CREATE TABLE IF NOT EXISTS vault_unlocks (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    companion_id TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, companion_id, photo_url)
);

CREATE INDEX IF NOT EXISTS idx_vault_unlocks_user ON vault_unlocks(user_id, companion_id);

-- 5. Referral Revenue Ledger (30% Rev-Share Tracking)
CREATE TABLE IF NOT EXISTS referral_ledger (
    id BIGSERIAL PRIMARY KEY,
    referrer_code TEXT NOT NULL,                     -- Referrer who earned commission
    referred_user_id TEXT NOT NULL,                  -- User whose transaction triggered rev-share
    amount_btc NUMERIC(16, 8) NOT NULL,              -- 30% cut in BTC
    amount_usd NUMERIC(10, 2) NOT NULL,              -- 30% cut in USD
    source TEXT NOT NULL,                            -- 'vip_purchase' | 'bitcoin_ad_view'
    transaction_id TEXT,                             -- Coinbase charge code or on-chain tx hash
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_referral_ledger_code ON referral_ledger(referrer_code);

-- 6. Updated At Automatic Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- 7. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_ledger ENABLE ROW LEVEL SECURITY;

-- Allow public reads and inserts via service role or matching session
CREATE POLICY "Allow public select on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public upsert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow read conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow insert conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read vault" ON vault_unlocks FOR SELECT USING (true);
CREATE POLICY "Allow insert vault" ON vault_unlocks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read referral ledger" ON referral_ledger FOR SELECT USING (true);
CREATE POLICY "Allow insert referral ledger" ON referral_ledger FOR INSERT WITH CHECK (true);
