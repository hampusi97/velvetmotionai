-- ==============================================================================
-- VelvetMotion AI - Supabase / PostgreSQL Production Schema
-- Includes Profiles, Long-Term Memory, Vector Embeddings, & Sentry Bug Telemetry
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Users / Profiles Table (with Bitcoin Payout Wallet & 30% Rev-Share)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  is_vip BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  btc_payout_address TEXT DEFAULT 'bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k',
  earned_btc NUMERIC(16, 8) DEFAULT 0.00000000,
  earned_usd NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_profiles_ref ON profiles(referral_code);

-- Legacy alias for compatibility with users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  wallet_address TEXT DEFAULT 'bc1qjmf9u3cmrn59q5nqmzgkvrgy7exegnfmph999k',
  is_vip BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  btc_balance NUMERIC(16, 8) DEFAULT 0.00000000,
  usd_balance NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Companion Chat Messages & Persistent Memory
CREATE TABLE IF NOT EXISTS companion_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  companion_id TEXT NOT NULL,
  sender TEXT NOT NULL, -- 'You' or companion name
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_companion_messages_user ON companion_messages(user_id, companion_id, created_at ASC);

-- 4. Unlocked Photo Vaults
CREATE TABLE IF NOT EXISTS unlocked_vaults (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  companion_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, companion_id, photo_url)
);

CREATE INDEX IF NOT EXISTS idx_unlocked_vaults_user ON unlocked_vaults(user_id, companion_id);

-- 5. Semantic Vector Memory Store (Long-Term AI Memory)
CREATE TABLE IF NOT EXISTS user_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  fact_summary TEXT NOT NULL,
  embedding VECTOR(1536), -- Vector representation for semantic similarity recall
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_user_memories_user ON user_memories(user_id);

-- 6. Sentry & Self-Healing Bug Telemetry Logs
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  url TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'logged', -- 'logged' | 'issue_created' | 'healed'
  github_issue_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_error_logs_status ON error_logs(status);

-- 7. Referral Revenue Ledger
CREATE TABLE IF NOT EXISTS referral_ledger (
  id BIGSERIAL PRIMARY KEY,
  referrer_code TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  amount_btc NUMERIC(16, 8) NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL,
  source TEXT NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all messages" ON companion_messages FOR ALL USING (true);
CREATE POLICY "Allow all vaults" ON unlocked_vaults FOR ALL USING (true);
CREATE POLICY "Allow all memories" ON user_memories FOR ALL USING (true);
CREATE POLICY "Allow all error_logs" ON error_logs FOR ALL USING (true);
CREATE POLICY "Allow all referral_ledger" ON referral_ledger FOR ALL USING (true);
