# 📧 Sistem Manajemen Surat dengan Google Drive Integration

## 🎯 **Fitur Utama**

### **✅ Google Drive Integration**
- Input surat via Google Drive file links
- Embedded viewer untuk preview file
- Auto-validation URL Google Drive
- Support semua format file (PDF, DOC, XLS, images, dll)
- Download langsung dari interface

### **✅ Sistem Surat Lengkap**
- **Surat Masuk**: Agenda numbering otomatis
- **Surat Keluar**: Penomoran otomatis dengan kode biro
- **Disposisi**: Workflow disposisi antar pengguna
- **Manajemen User**: Role-based access control
- **Dashboard**: Analytics dan statistik

### **✅ UI/UX Modern**
- Responsive design (mobile-friendly)
- Dark/Light mode support
- Animations dengan Framer Motion
- Toast notifications
- Search dan filter functionality

---

## 🚀 **Quick Deploy Guide**

### **1. Vercel Deployment (Recommended)**

```bash
# Clone dan deploy
git clone https://github.com/your-username/sistem-surat.git
cd sistem-surat

# Deploy dengan Vercel CLI
npm i -g vercel
vercel

# Atur environment variables di Vercel dashboard:
# NODE_ENV=production
# VITE_APP_NAME=Sistem Manajemen Surat
# VITE_APP_VERSION=2.0
```

### **2. Manual Upload**

1. **Download file zip** deployment ini
2. **Extract** ke folder project
3. **Upload ke GitHub/GitLab**
4. **Connect ke Vercel**
5. **Configure environment variables**

---

## 📋 **Penggunaan**

### **Membuat Surat Baru**
1. **Login** dengan credentials yang tersedia
2. **Klik "Tambah Surat"** (untuk surat masuk) atau **"Buat Surat Keluar"**
3. **Isi form** dengan data umum
4. **Input Google Drive URL** (format: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)
5. **Klik "Simpan"**

### **Mengakses Surat**
- **Preview**: Klik icon mata untuk lihat detail + embedded viewer
- **Buka di Drive**: Klik icon untuk buka di tab baru
- **Download**: Download file langsung dari interface

### **Setup Google Drive File**
1. **Upload file** ke Google Drive
2. **Right-click** → **"Share"**
3. **Set permission**: "Anyone with the link can view"
4. **Copy link** dan paste ke form

---

## 👥 **Default Users**

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `superadmin` | `admin` | Super Admin | Full access |
| `kpa` | `password` | Ketua PA | Admin view |
| `sekretaris` | `password` | Sekretaris | Admin view |
| `kasub_umum` | `password` | Kasub Umum | Input surat masuk |
| `pelaksana_umum` | `password` | Staf Umum | Input surat keluar |
| `panitera` | `password` | Panitera | Admin view |

---

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18.2.0** - UI framework
- **Vite 4.4.5** - Build tool
- **Tailwind CSS 3.3.3** - Styling
- **Framer Motion 10.16.4** - Animations
- **React Router 6.16.0** - Navigation
- **Radix UI** - Component library

### **Storage & Backend**
- **LocalStorage** - Default (production ready)
- **Supabase PostgreSQL** - Optional database
- **Google Drive API** - File storage

### **Deployment**
- **Vercel** - Hosting platform
- **CDN Global** - Performance
- **SSL/HTTPS** - Security

---

## 🔧 **Konfigurasi Environment**

### **Production (.env)**
```env
NODE_ENV=production
VITE_APP_NAME=Sistem Manajemen Surat
VITE_APP_VERSION=2.0
```

### **With Supabase (Optional)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

---

## 📁 **File Structure**

```
sistem-surat/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── google-drive-viewer.jsx    # Google Drive file viewer
│   │   │   ├── google-drive-input.jsx     # Google Drive URL input
│   │   │   └── alert.jsx                  # Alert component
│   │   ├── dialogs/
│   │   │   ├── MailFormDialog.jsx         # Form untuk create/edit surat
│   │   │   └── MailDetailDialog.jsx       # Detail view dengan viewer
│   │   └── layouts/
│   ├── contexts/
│   │   ├── AuthContext.jsx                # Authentication
│   │   └── MailContext.jsx                # Mail management
│   ├── pages/
│   │   ├── IncomingMailPage.jsx           # Surat masuk
│   │   ├── OutgoingMailPage.jsx           # Surat keluar
│   │   └── DashboardPage.jsx              # Dashboard
│   └── lib/
│       └── mail-data.js                   # Mail classifications
├── dist/                                  # Build output
├── supabase-setup.sql                     # Database schema
├── vercel.json                           # Vercel config
├── .env.example                          # Environment template
└── DEPLOYMENT_GUIDE.md                   # Deployment instructions
```

---

## 🔒 **Security Features**

### **Authentication**
- LocalStorage-based session management
- Role-based access control
- Guest access untuk view-only

### **Data Protection**
- Client-side validation
- HTTPS enforcement
- CORS configuration
- Security headers

### **File Security**
- Google Drive permission-based access
- No direct file upload to server
- External file validation

---

## 📊 **Performance**

### **Build Optimization**
- Vite bundling dengan tree shaking
- Code splitting otomatis
- Asset optimization
- CSS purging

### **Runtime Performance**
- React 18 concurrent features
- Optimized re-renders
- Lazy loading components
- Efficient state management

### **CDN Performance**
- Global edge caching
- Automatic image optimization
- Gzip compression
- HTTP/2 support

---

## 🐛 **Troubleshooting**

### **Google Drive Not Loading**
- ✅ Check URL format (must be Google Drive share link)
- ✅ Verify file permissions ("Anyone with link can view")
- ✅ Test in incognito mode
- ✅ Check network connectivity

### **Build Errors**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Deployment Issues**
- Check Vercel deployment logs
- Verify environment variables
- Ensure build command: `npm run build`
- Output directory: `dist`

### **Performance Issues**
- Enable Vercel Analytics
- Check bundle size
- Monitor Core Web Vitals
- Optimize images

---

## 📈 **Analytics & Monitoring**

### **Built-in Analytics**
- Page view tracking
- Performance metrics
- Error tracking
- User session data

### **Optional Integrations**
- **Google Analytics 4**
- **Sentry Error Tracking**
- **Vercel Analytics**
- **Supabase Real-time**

---

## 🔄 **Updates & Maintenance**

### **Regular Updates**
- Security patches
- Dependency updates
- Feature enhancements
- Bug fixes

### **Backup Strategy**
- Database backups (Supabase)
- Code repository (Git)
- Environment configurations
- User data export

---

## 📞 **Support**

### **Technical Support**
- 📧 Email: support@example.com
- 💬 Chat: Available during business hours
- 📚 Documentation: See DEPLOYMENT_GUIDE.md

### **Features Request**
- 🐛 Bug reports: Create GitHub issue
- 💡 Feature requests: Create GitHub issue
- 📖 Documentation improvements: Welcome

---

## 📄 **License**

Proprietary - Untuk Penggunaan Pengadilan Agama

---

## 🙏 **Credits**

- **Development**: MiniMax Agent
- **UI Components**: Radix UI, Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: Google Drive API
- **Hosting**: Vercel Platform

---

*📅 **Version**: 2.0 - Google Drive Integration*  
*🔧 **Last Updated**: November 2025*  
*🚀 **Status**: Production Ready*