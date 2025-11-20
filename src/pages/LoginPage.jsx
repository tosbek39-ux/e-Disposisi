import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleResetData = () => {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('incoming_mails');
    localStorage.removeItem('outgoing_mails');
    localStorage.removeItem('dispositions');
    toast({
      title: "Data Direset! 🔄",
      description: "Data aplikasi telah direset. Silakan refresh halaman.",
    });
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    
    if (result.success) {
      toast({
        title: `Login Berhasil! 🎉`,
        description: result.message || `Selamat datang di E-Disposisi PA Solok`,
      });
    } else {
      toast({
        title: "Login Gagal",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4"
            >
              <Mail className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text mb-2">E-Disposisi</h1>
            <p className="text-gray-500 font-semibold">Pengadilan Agama Solok</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Masuk
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-600 mb-2 font-medium">Contoh Login (pass: password):</p>
            <p className="text-xs text-gray-500">kpa, sekretaris, panitera, kasub_umum, panmud_gugatan, pelaksana_umum, superadmin (pass: admin)</p>
          </div>

          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetData}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              Reset Data Aplikasi
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;