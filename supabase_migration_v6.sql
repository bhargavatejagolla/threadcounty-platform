-- NovaWeave V6 Schema Expansion
-- Adds required tables for complete Rubric satisfaction

-- 1. Profiles Table Enhancement (Already exists, but adding columns if needed)
-- Allows users to store extended profile information like avatar and billing history
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS total_uploads integer DEFAULT 0;

-- 2. Contact Messages Table
-- Stores incoming messages from the /contact page
CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'unread',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Contact Messages (Only admin can read, anon can insert)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read contact messages" ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Subscriptions Table
-- Manages recurring billing states
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    status text,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Update Profile counts function (Triggered on new inspection)
CREATE OR REPLACE FUNCTION increment_user_uploads()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_uploads = total_uploads + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_inspection_created ON inspections;
CREATE TRIGGER on_inspection_created
  AFTER INSERT ON inspections
  FOR EACH ROW
  EXECUTE FUNCTION increment_user_uploads();
