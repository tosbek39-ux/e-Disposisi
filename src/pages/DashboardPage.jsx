import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, FileText, TrendingUp, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useMail } from '@/contexts/MailContext';

const DashboardPage = () => {
  const { incomingMail, outgoingMail, dispositions } = useMail();
  const [stats, setStats] = useState({
    incomingMail: 0,
    outgoingMail: 0,
    dispositions: 0,
    pending: 0,
    notUploaded: 0
  });

  useEffect(() => {
    setStats({
      incomingMail: incomingMail.length,
      outgoingMail: outgoingMail.length,
      dispositions: dispositions.length,
      pending: dispositions.filter(d => d.status === 'pending').length,
      notUploaded: outgoingMail.filter(m => !m.uploaded).length
    });
  }, [incomingMail, outgoingMail, dispositions]);

  const statCards = [
    { 
      title: 'Surat Masuk', 
      value: stats.incomingMail, 
      icon: Mail, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Surat Keluar', 
      value: stats.outgoingMail, 
      icon: Send, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Total Disposisi', 
      value: stats.dispositions, 
      icon: FileText, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Menunggu Disposisi', 
      value: stats.pending, 
      icon: Clock, 
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Sistem Disposisi Surat</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {stats.notUploaded > 0 && (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 rounded-lg shadow-md"
        >
            <AlertTriangle className="w-6 h-6 mr-3" />
            <div className="flex-1">
                <p className="font-bold">Peringatan</p>
                <p>Terdapat <span className="font-bold">{stats.notUploaded}</span> surat keluar yang belum diunggah filenya.</p>
            </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold gradient-text">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 gradient-text">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Surat masuk baru diterima</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 gradient-text">Statistik Bulanan</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Surat Masuk</span>
                <span className="font-semibold">{stats.incomingMail}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.incomingMail / 100) * 100}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Surat Keluar</span>
                <span className="font-semibold">{stats.outgoingMail}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.outgoingMail / 100) * 100}%` }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disposisi</span>
                <span className="font-semibold">{stats.dispositions}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.dispositions / 100) * 100}%` }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;