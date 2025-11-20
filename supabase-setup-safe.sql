-- Supabase Configuration untuk Sistem Manajemen Surat
-- SAFE VERSION - Using IF NOT EXISTS untuk mencegah duplicate table errors
-- Execute this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table dengan role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  sign_code TEXT,
  on_leave BOOLEAN DEFAULT false,
  substitute UUID REFERENCES users(id),
  path TEXT,
  can_input_incoming BOOLEAN DEFAULT false,
  can_input_outgoing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mail types classifications
CREATE TABLE IF NOT EXISTS mail_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Incoming mails
CREATE TABLE IF NOT EXISTS incoming_mails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  received_date DATE NOT NULL,
  mail_date DATE,
  google_drive_file_url TEXT,
  classification_code TEXT NOT NULL,
  initial_recipient_id UUID REFERENCES users(id),
  agenda_number TEXT NOT NULL,
  content TEXT, -- For backward compatibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Outgoing mails
CREATE TABLE IF NOT EXISTS outgoing_mails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  google_drive_file_url TEXT,
  signatory TEXT NOT NULL,
  classification_code TEXT NOT NULL,
  mail_number TEXT NOT NULL,
  content TEXT, -- For backward compatibility
  uploaded BOOLEAN DEFAULT false,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dispositions
CREATE TABLE IF NOT EXISTS dispositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mail_id UUID REFERENCES incoming_mails(id) ON DELETE CASCADE,
  mail_number TEXT,
  date DATE DEFAULT CURRENT_DATE,
  instruction TEXT,
  status TEXT DEFAULT 'pending',
  recipient_id UUID REFERENCES users(id),
  recipient_name TEXT,
  history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mail counters untuk auto-numbering
CREATE TABLE IF NOT EXISTS mail_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counter_type TEXT UNIQUE NOT NULL,
  current_value INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default users ONLY IF NOT EXISTS
-- Using individual INSERT statements to avoid UUID type casting issues
DO $$
BEGIN
  -- Insert kpa
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'kpa') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('kpa', 'Ketua Pengadilan Agama', 'kpa', 'KPA', false, 'kpa', false, false);
  END IF;

  -- Insert sekretaris
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'sekretaris') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('sekretaris', 'Sekretaris', 'sekretaris', 'SEK', false, 'kpa.sekretaris', false, false);
  END IF;

  -- Insert panitera
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'panitera') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('panitera', 'Panitera', 'panitera', 'PAN', false, 'kpa.panitera', false, false);
  END IF;

  -- Insert kasub_umum
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'kasub_umum') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('kasub_umum', 'Kasub Umum Keuangan', 'kasub_umum', 'SEK.03', false, 'kpa.sekretaris.kasub_umum', true, false);
  END IF;

  -- Insert kasub_kepeg
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'kasub_kepeg') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('kasub_kepeg', 'Kasub Kepegawaian', 'kasub', 'SEK.02', false, 'kpa.sekretaris.kasub_kepeg', false, false);
  END IF;

  -- Insert kasub_ptip
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'kasub_ptip') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('kasub_ptip', 'Kasub PTIP', 'kasub', 'SEK.01', false, 'kpa.sekretaris.kasub_ptip', false, false);
  END IF;

  -- Insert panmud_gugatan
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'panmud_gugatan') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('panmud_gugatan', 'Panitera Muda Gugatan', 'panmud', 'PAN.02', false, 'kpa.panitera.panmud_gugatan', false, false);
  END IF;

  -- Insert panmud_hukum
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'panmud_hukum') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('panmud_hukum', 'Panitera Muda Hukum', 'panmud', 'PAN.03', false, 'kpa.panitera.panmud_hukum', false, false);
  END IF;

  -- Insert panmud_permohonan
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'panmud_permohonan') THEN
    INSERT INTO users (username, name, role, sign_code, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('panmud_permohonan', 'Panitera Muda Permohonan', 'panmud', 'PAN.01', false, 'kpa.panitera.panmud_permohonan', false, false);
  END IF;

  -- Insert pelaksana_umum
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'pelaksana_umum') THEN
    INSERT INTO users (username, name, role, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('pelaksana_umum', 'Staf Pelaksana Umum', 'pelaksana', false, 'kpa.sekretaris.kasub_umum.pelaksana', false, true);
  END IF;

  -- Insert pelaksana_kepeg
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'pelaksana_kepeg') THEN
    INSERT INTO users (username, name, role, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('pelaksana_kepeg', 'Staf Pelaksana Kepegawaian', 'pelaksana', false, 'kpa.sekretaris.kasub_kepeg.pelaksana', false, false);
  END IF;

  -- Insert pelaksana_ptip
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'pelaksana_ptip') THEN
    INSERT INTO users (username, name, role, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('pelaksana_ptip', 'Staf Pelaksana PTIP', 'pelaksana', false, 'kpa.sekretaris.kasub_ptip.pelaksana', false, false);
  END IF;

  -- Insert pelaksana_gugatan
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'pelaksana_gugatan') THEN
    INSERT INTO users (username, name, role, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('pelaksana_gugatan', 'Staf Pelayanan Gugatan', 'pelaksana', false, 'kpa.panitera.panmud_gugatan.pelaksana', false, false);
  END IF;

  -- Insert superadmin
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'superadmin') THEN
    INSERT INTO users (username, name, role, on_leave, path, can_input_incoming, can_input_outgoing) 
    VALUES ('superadmin', 'Super Admin', 'superadmin', false, 'superadmin', true, true);
  END IF;
END $$;

-- Insert mail types classifications ONLY IF NOT EXISTS
INSERT INTO mail_types (code, name, category) 
SELECT * FROM (VALUES
  ('S.3', 'Surat Biasa', 'Surat'),
  ('S.5', 'Surat Keputusan', 'Surat'),
  ('S.6', 'Surat Edaran', 'Surat'),
  ('S.7', 'Surat Perintah', 'Surat'),
  ('S.8', 'Surat Tugas', 'Surat'),
  ('B.1', 'Berkas Perkara', 'Berkas'),
  ('B.2', 'Berkas Permohonan', 'Berkas'),
  ('B.3', 'Berkas Pembatalan', 'Berkas'),
  ('K.1', 'Korespondensi Masuk', 'Korespondensi'),
  ('K.2', 'Korespondensi Keluar', 'Korespondensi')
) AS v(code, name, category)
WHERE NOT EXISTS (
  SELECT 1 FROM mail_types WHERE mail_types.code = v.code
);

-- Insert mail counters ONLY IF NOT EXISTS
INSERT INTO mail_counters (counter_type, current_value) 
SELECT * FROM (VALUES
  ('incoming', 1),
  ('outgoing', 1)
) AS v(counter_type, current_value)
WHERE NOT EXISTS (
  SELECT 1 FROM mail_counters WHERE mail_counters.counter_type = v.counter_type
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE incoming_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE outgoing_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_counters ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access (supabase auth)
-- Drop existing policies first to avoid duplicate errors
DROP POLICY IF EXISTS "Users can view all data" ON users;
CREATE POLICY "Users can view all data" ON users FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Mail types are public" ON mail_types;
CREATE POLICY "Mail types are public" ON mail_types FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Incoming mails viewable by authenticated users" ON incoming_mails;
CREATE POLICY "Incoming mails viewable by authenticated users" ON incoming_mails FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Outgoing mails viewable by authenticated users" ON outgoing_mails;
CREATE POLICY "Outgoing mails viewable by authenticated users" ON outgoing_mails FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Dispositions viewable by authenticated users" ON dispositions;
CREATE POLICY "Dispositions viewable by authenticated users" ON dispositions FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Mail counters are readable" ON mail_counters;
CREATE POLICY "Mail counters are readable" ON mail_counters FOR SELECT TO authenticated USING (true);

-- Create update policies (authenticated users can update)
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update incoming mails" ON incoming_mails;
CREATE POLICY "Authenticated users can update incoming mails" ON incoming_mails FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update outgoing mails" ON outgoing_mails;
CREATE POLICY "Authenticated users can update outgoing mails" ON outgoing_mails FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update dispositions" ON dispositions;
CREATE POLICY "Authenticated users can update dispositions" ON dispositions FOR UPDATE USING (auth.role() = 'authenticated');

-- Create insert policies
DROP POLICY IF EXISTS "Authenticated users can insert incoming mails" ON incoming_mails;
CREATE POLICY "Authenticated users can insert incoming mails" ON incoming_mails FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert outgoing mails" ON outgoing_mails;
CREATE POLICY "Authenticated users can insert outgoing mails" ON outgoing_mails FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert dispositions" ON dispositions;
CREATE POLICY "Authenticated users can insert dispositions" ON dispositions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_incoming_mails_date ON incoming_mails(received_date);
CREATE INDEX IF NOT EXISTS idx_incoming_mails_sender ON incoming_mails(sender);
CREATE INDEX IF NOT EXISTS idx_outgoing_mails_date ON outgoing_mails(date);
CREATE INDEX IF NOT EXISTS idx_outgoing_mails_recipient ON outgoing_mails(recipient);
CREATE INDEX IF NOT EXISTS idx_dispositions_mail_id ON dispositions(mail_id);
CREATE INDEX IF NOT EXISTS idx_dispositions_recipient ON dispositions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_dispositions_status ON dispositions(status);

-- Create functions untuk auto-updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers untuk auto-updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_incoming_mails_updated_at ON incoming_mails;
CREATE TRIGGER update_incoming_mails_updated_at BEFORE UPDATE ON incoming_mails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_outgoing_mails_updated_at ON outgoing_mails;
CREATE TRIGGER update_outgoing_mails_updated_at BEFORE UPDATE ON outgoing_mails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dispositions_updated_at ON dispositions;
CREATE TRIGGER update_dispositions_updated_at BEFORE UPDATE ON dispositions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function untuk auto-numbering incoming mails
CREATE OR REPLACE FUNCTION generate_incoming_agenda_number()
RETURNS TRIGGER AS $$
DECLARE
  current_counter INTEGER;
  year_val INTEGER;
  month_roman TEXT;
  new_agenda_number TEXT;
BEGIN
  -- Get current counter
  SELECT current_value INTO current_counter 
  FROM mail_counters 
  WHERE counter_type = 'incoming';
  
  -- Update counter
  UPDATE mail_counters 
  SET current_value = current_value + 1 
  WHERE counter_type = 'incoming';
  
  -- Get year and month
  year_val := EXTRACT(year FROM NEW.received_date);
  
  -- Convert month to roman numerals
  CASE EXTRACT(month FROM NEW.received_date)
    WHEN 1 THEN month_roman := 'I';
    WHEN 2 THEN month_roman := 'II';
    WHEN 3 THEN month_roman := 'III';
    WHEN 4 THEN month_roman := 'IV';
    WHEN 5 THEN month_roman := 'V';
    WHEN 6 THEN month_roman := 'VI';
    WHEN 7 THEN month_roman := 'VII';
    WHEN 8 THEN month_roman := 'VIII';
    WHEN 9 THEN month_roman := 'IX';
    WHEN 10 THEN month_roman := 'X';
    WHEN 11 THEN month_roman := 'XI';
    WHEN 12 THEN month_roman := 'XII';
  END CASE;
  
  -- Generate agenda number
  NEW.agenda_number := 'SM' || current_counter || '/' || NEW.classification_code || '/' || month_roman || '/' || year_val;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger untuk auto-generate incoming agenda number
DROP TRIGGER IF EXISTS generate_incoming_agenda_number_trigger ON incoming_mails;
CREATE TRIGGER generate_incoming_agenda_number_trigger 
  BEFORE INSERT ON incoming_mails 
  FOR EACH ROW EXECUTE FUNCTION generate_incoming_agenda_number();

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;