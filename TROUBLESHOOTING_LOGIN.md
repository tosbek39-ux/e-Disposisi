# 🔧 TROUBLESHOOTING LOGIN - E-Disposisi PA Solok

## 🚨 MASALAH LOGIN DAN SOLUSINYA

### 1. ** Tidak Bisa Login - Blank Screen/Halaman Putih**
**Kemungkinan Penyebab:**
- Browser cache yang corrupt
- localStorage data corrupt
- React Helmet import error

**Solusi:**
```bash
# Option 1: Clear browser data
1. Tekan F12 (Developer Tools)
2. Tab "Application" -> "Local Storage" -> Clear All
3. Refresh halaman

# Option 2: Gunakan tombol reset di halaman login
1. Di halaman login, scroll ke bawah
2. Klik "Reset Data Aplikasi"
3. Refresh halaman
```

### 2. **Error "UseAuth must be used within AuthProvider"**
**Penyebab:** Context tidak ter-load dengan benar

**Solusi:**
- Pastikan tidak ada refresh page saat login
- Hapus semua data localStorage

### 3. **Toast Notification Tidak Muncul**
**Penyebab:** Toast component bermasalah

**Solusi:**
```javascript
// Buka console browser, jalankan:
localStorage.removeItem('currentUser');
location.reload();
```

### 4. **Login Berhasil Tapi Kembali ke Halaman Login**
**Penyebab:** Route/authentication flow bermasalah

**Solusi:**
- Periksa `isAuthenticated` di browser console
- Clear localStorage dan login ulang

## 🧪 DEBUGGING TOOLS

### Console Commands (Buka F12 -> Console)

```javascript
// Check users data
console.log('Users:', JSON.parse(localStorage.getItem('users')));

// Check current session
console.log('Current User:', JSON.parse(localStorage.getItem('currentUser')));

// Test login manually
const testUser = JSON.parse(localStorage.getItem('users')).find(u => u.username === 'kpa');
console.log('Test user kpa:', testUser);

// Fix common issues
localStorage.removeItem('users');
localStorage.removeItem('currentUser');
location.reload();
```

### Load Debug Script
1. Buka Developer Tools (F12)
2. Tab "Sources" 
3. Add new script atau paste di Console:
```javascript
// Copy isi file debug-login.js di sini
```

## 🔑 LOGIN CREDENTIALS YANG BERFUNGSI

**User Biasa (Password: `password`):**
- `kpa` - Ketua Pengadilan Agama
- `sekretaris` - Sekretaris  
- `panitera` - Panitera
- `kasub_umum` - Kasub Umum
- `panmud_gugatan` - Panitera Muda Gugatan
- `pelaksana_umum` - Staf Pelaksana Umum

**Super Admin (Password: `admin`):**
- `superadmin` - Super Admin (akses penuh)

## 🔍 LOGS YANG HARUS DILIHAT

**Console Logs yang Normal:**
```
✅ "Login attempt: {username, password}"
✅ "Available users: ['kpa', 'sekretaris', ...]"
✅ "Found user: kpa" 
✅ "Login berhasil sebagai [Nama User]"
```

**Console Logs yang Bermasalah:**
```
❌ "UseAuth must be used within AuthProvider"
❌ "Error parsing users"
❌ "Login test FAILED"
❌ "TypeError: Cannot read property 'username'"
```

## 🛠️ PERBAIKAN CEPAT

### Reset Semua Data
```javascript
localStorage.clear();
location.reload();
```

### Recreate Default Users
```javascript
// Ini akan dilakukan otomatis saat reload page
// User default akan dibuat ulang
```

### Force New Session
```javascript
localStorage.removeItem('currentUser');
location.reload();
```

## 📞 JIKA MASIH BERMASALAH

1. **Buka Browser Console (F12)** dan periksa error messages
2. **Gunakan tombol "Reset Data Aplikasi"** di halaman login
3. **Clear browser cache** (Ctrl+Shift+R atau Cmd+Shift+R)
4. **Coba browser berbeda** (Chrome, Firefox, Edge)
5. **Disable browser extensions** yang mungkin interfere

## ✅ CHECKLIST VERIFIKASI

- [ ] localStorage.users ada dan bisa di-parse
- [ ] Username dan password sesuai dengan data
- [ ] Toast notification muncul setelah login
- [ ] Tidak ada error di browser console
- [ ] Halaman dashboard muncul setelah login sukses

---

**Quick Fix Command (Copy-Paste di Console):**
```javascript
localStorage.clear(); setTimeout(()=>location.reload(),500);
```