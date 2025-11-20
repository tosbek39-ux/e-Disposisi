# 🚀 Deployment Guide - Sistem Manajemen Surat dengan Google Drive

## 📋 **Persiapan Deployment**

### **1. Upload ke Git Repository**
```bash
# Inisialisasi git repository
git init
git add .
git commit -m "Initial commit: Sistem Surat dengan Google Drive Integration"

# Push ke GitHub/GitLab
git remote add origin https://github.com/your-username/sistem-surat.git
git branch -M main
git push -u origin main
```

### **2. Deploy ke Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: sistem-surat-pengadilan
# - Directory: ./
# - Override settings? N
# - Environment variables: Y (dari .env.example)
```

### **3. Setup Environment Variables di Vercel Dashboard**
1. Buka [vercel.com](https://vercel.com) dan login
2. Pilih project yang baru dibuat
3. Settings → Environment Variables
4. Tambahkan variables dari file `.env.example`:

```
NODE_ENV=production
VITE_APP_NAME=Sistem Manajemen Surat
VITE_APP_VERSION=2.0
```

### **4. (Optional) Setup Supabase**
```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Initialize project
supabase init

# Deploy database schema
supabase db push
```

---

## 🔧 **Konfigurasi Production**

### **Vercel Configuration**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`
- **Node.js Version**: 18.x (default)

### **Domain & SSL**
- **Custom Domain**: `sistem-surat.pengadilan.example`
- **SSL**: Otomatis via Let's Encrypt
- **CDN**: Global Vercel Edge Network

---

## 🗄️ **Supabase Setup (Opsional)**

### **Database Schema**
```sql
-- Users table dengan role-based access
CREATE TABLE users (
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

-- Mail tables
CREATE TABLE incoming_mails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  received_date DATE NOT NULL,
  mail_date DATE,
  google_drive_file_url TEXT,
  classification_code TEXT NOT NULL,
  initial_recipient_id UUID REFERENCES users(id),
  agenda_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE outgoing_mails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  google_drive_file_url TEXT,
  signatory TEXT NOT NULL,
  classification_code TEXT NOT NULL,
  mail_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dispositions table
CREATE TABLE dispositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mail_id UUID REFERENCES incoming_mails(id),
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incoming_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE outgoing_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispositions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Users can view all data" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Incoming mails viewable by authenticated users" ON incoming_mails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Outgoing mails viewable by authenticated users" ON outgoing_mails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Dispositions viewable by authenticated users" ON dispositions FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 🔐 **Security Configuration**

### **Row Level Security (RLS)**
- ✅ **Users**: Access berdasarkan authentication
- ✅ **Mails**: Role-based access control
- ✅ **Dispositions**: User-specific permissions

### **API Security**
- ✅ **CORS**: Configured untuk domain production
- ✅ **Headers**: Security headers configured
- ✅ **SSL**: HTTPS mandatory

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- Page views
- Performance metrics
- Error tracking
- Core Web Vitals

### **Supabase Analytics**
- Database performance
- API usage
- Real-time metrics

---

## 🚀 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Code updated dengan Google Drive integration
- [ ] Dependencies updated (`npm audit fix`)
- [ ] Environment variables configured
- [ ] Git repository ready

### **Deployment**
- [ ] Push ke GitHub/GitLab
- [ ] Connect repository ke Vercel
- [ ] Configure environment variables
- [ ] Deploy dan test

### **Post-Deployment**
- [ ] Test semua fitur Google Drive
- [ ] Verify user authentication
- [ ] Test responsive design
- [ ] Setup custom domain (optional)

### **Monitoring**
- [ ] Setup error tracking (Sentry)
- [ ] Configure alerts
- [ ] Monitor performance
- [ ] Setup backups

---

## 🔧 **Troubleshooting**

### **Common Issues**

**Build Errors:**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Google Drive Not Loading:**
- Check URL format (must be Google Drive share link)
- Verify file permissions ("Anyone with link can view")
- Test in incognito mode

**Environment Variables:**
- Check .env file syntax
- Verify variable names (must start with VITE_)
- Restart deployment after changes

---

## 📞 **Support**

**Deployment Issues:**
1. Check Vercel deployment logs
2. Verify environment variables
3. Test build locally dengan `npm run build`

**Google Drive Integration:**
1. Test URL format
2. Check file permissions
3. Verify network connectivity

**Performance Issues:**
1. Enable Vercel Analytics
2. Monitor Core Web Vitals
3. Optimize bundle size

---

*📅 Last Updated: November 2025*
*🔧 Version: 2.0 - Google Drive Integration*
*🚀 Ready for Production Deployment*