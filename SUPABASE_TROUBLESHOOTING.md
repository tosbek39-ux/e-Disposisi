# 🔧 TROUBLESHOOTING SUPABASE - Database Setup Errors

## 🚨 MASALAH UMUM DAN SOLUSINYA

### **1. ERROR 42P07 - RELATION ALREADY EXISTS**

**Error Message:**
```
Error: Failed to run sql query: ERROR: 42P07: relation "users" already exists
```

**Penyebab:**
- Script SQL sudah dijalankan sebelumnya
- Tabel sudah ada di database Supabase
- CREATE TABLE tidak menggunakan IF NOT EXISTS

### **2. ERROR 42804 - TYPE CASTING ERROR (UUID)**

**Error Message:**
```
Error: Failed to run sql query: ERROR: 42804: column "substitute" is of type uuid but expression is of type text
```

**Penyebab:**
- UUID column diisi dengan NULL value tanpa proper casting
- VALUES clause dalam INSERT statement infer types secara otomatis

**Solusi:**
- Script sudah diperbaiki menggunakan DO blocks untuk individual INSERT
- Menghindari type casting issues dengan tidak include column substitute

## ✅ SOLUSI: GUNAKAN SCRIPT SAFE (RECOMMENDED)

### **File: `supabase-setup-safe.sql`**

Script ini sudah diperbaiki untuk menjalankan CREATE TABLE IF NOT EXISTS dan INSERT IF NOT EXISTS.

**Langkah:**
1. Buka **Supabase Dashboard**
2. Pergi ke **SQL Editor**
3. Copy-paste semua isi dari file `supabase-setup-safe.sql`
4. Execute script
5. ✅ **Berhasil! Tidak ada error duplicate**

## 🔄 SOLUSI 2: RESET DATABASE (DESTRUCTIVE)

**⚠️ PERHATIAN: Akan menghapus semua data existing**

### **Opsi A: Drop Semua Tabel**
```sql
-- Jalankan di Supabase SQL Editor:
DROP TABLE IF EXISTS dispositions, outgoing_mails, incoming_mails, mail_types, mail_counters, users CASCADE;

-- Kemudian jalankan script aslinya:
-- Copy isi dari supabase-setup.sql dan execute
```

### **Opsi B: Full Reset Database**
1. Pergi ke **Settings > Database**
2. Klik **"Reset Database"**
3. **WARNING**: Semua data akan hilang!

## 🛠️ SOLUSI 3: ALTER TABLE (NON-DESTRUCTIVE)

### **Script untuk Menambah Kolom yang Hilang**
```sql
-- Jika ada kolom yang missing di tabel existing:
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_input_incoming BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_input_outgoing BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS path TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sign_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS on_leave BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS substitute UUID;

-- Update users yang sudah ada:
UPDATE users SET 
  can_input_incoming = CASE 
    WHEN role = 'superadmin' OR role = 'kasub_umum' THEN true 
    ELSE false 
  END,
  can_input_outgoing = CASE 
    WHEN role = 'superadmin' OR role = 'pelaksana' THEN true 
    ELSE false 
  END,
  path = CASE role
    WHEN 'kpa' THEN 'kpa'
    WHEN 'sekretaris' THEN 'kpa.sekretaris'
    WHEN 'panitera' THEN 'kpa.panitera'
    WHEN 'kasub_umum' THEN 'kpa.sekretaris.kasub_umum'
    WHEN 'kasub' THEN 'kpa.sekretaris.' || role
    WHEN 'panmud' THEN 'kpa.panitera.' || role
    WHEN 'pelaksana' THEN 'kpa.sekretaris.kasub_umum.pelaksana'
    WHEN 'superadmin' THEN 'superadmin'
  END,
  sign_code = CASE role
    WHEN 'kpa' THEN 'KPA'
    WHEN 'sekretaris' THEN 'SEK'
    WHEN 'panitera' THEN 'PAN'
    WHEN 'kasub_umum' THEN 'SEK.03'
    WHEN 'kasub_kepeg' THEN 'SEK.02'
    WHEN 'kasub_ptip' THEN 'SEK.01'
    WHEN 'panmud_gugatan' THEN 'PAN.02'
    WHEN 'panmud_hukum' THEN 'PAN.03'
    WHEN 'panmud_permohonan' THEN 'PAN.01'
    WHEN 'superadmin' THEN null
  END
WHERE can_input_incoming IS NULL OR can_input_outgoing IS NULL;
```

## 📋 SCRIPT SAFE UNTUK CHECK EXISTING DATA

```sql
-- Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check existing users
SELECT username, name, role 
FROM users 
ORDER BY username;

-- Check if users already have required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public' 
ORDER BY column_name;
```

## 🚀 DEPLOYMENT STEP-BY-STEP

### **1. Check Current Database State**
```sql
-- Jalankan di Supabase SQL Editor untuk melihat tables yang sudah ada
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

### **2. Pilih Solution**
- **✅ RECOMMENDED**: Gunakan `supabase-setup-safe.sql` (non-destructive)
- **Alternative**: Drop dan recreate (destructive)
- **Alternative**: Alter existing tables (non-destructive)

### **3. Execute Script**
```sql
-- Copy-paste script yang dipilih ke Supabase SQL Editor
-- Klik Run
-- Check results
```

### **4. Verify Results**
```sql
-- Check users sudah ada
SELECT username, name, role, can_input_incoming, can_input_outgoing FROM users;

-- Check mail types
SELECT * FROM mail_types;

-- Check counters
SELECT * FROM mail_counters;
```

## 🔍 DIAGNOSIS CEK DATABASE

### **Check Existing Tables**
```sql
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### **Check Column Structure**
```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public' 
ORDER BY ordinal_position;
```

### **Check Existing Policies**
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

## ⚡ QUICK FIX COMMANDS

### **Reset Policies (Jika RLS bermasalah)**
```sql
-- Drop all policies
DROP POLICY IF EXISTS "Users can view all data" ON users;
DROP POLICY IF EXISTS "Mail types are public" ON mail_types;
DROP POLICY IF EXISTS "Incoming mails viewable by authenticated users" ON incoming_mails;
DROP POLICY IF EXISTS "Outgoing mails viewable by authenticated users" ON outgoing_mails;
DROP POLICY IF EXISTS "Dispositions viewable by authenticated users" ON dispositions;
DROP POLICY IF EXISTS "Mail counters are readable" ON mail_counters;

-- Recreate basic policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE incoming_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE outgoing_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_counters ENABLE ROW LEVEL SECURITY;

-- Basic select policies
CREATE POLICY "Users can view all data" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Mail types are public" ON mail_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Incoming mails viewable by authenticated users" ON incoming_mails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Outgoing mails viewable by authenticated users" ON outgoing_mails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Dispositions viewable by authenticated users" ON dispositions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Mail counters are readable" ON mail_counters FOR SELECT TO authenticated USING (true);
```

## 🎯 RECOMMENDED APPROACH

**Untuk Production:**
1. ✅ Gunakan `supabase-setup-safe.sql` 
2. ✅ Script idempotent (bisa dijalankan berulang)
3. ✅ Tidak menghapus data existing
4. ✅ Menambah data yang missing

**Emergency Fix:**
```sql
-- Jika masih error, reset RLS dan policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- Kemudian enable lagi dan create basic policies
```

---

## ✅ CHECKLIST SUPABASE SETUP

- [ ] Database tables created successfully
- [ ] Default users inserted (14 users)
- [ ] Mail types inserted (10 types)
- [ ] Mail counters initialized
- [ ] Row Level Security enabled
- [ ] Policies created for authenticated users
- [ ] Triggers for auto-numbering working
- [ ] Indexes created for performance
- [ ] Permissions granted to authenticated role

**File utama:** `supabase-setup-safe.sql` - Script yang sudah diperbaiki untuk production use.