import React from 'react';
import { motion } from 'framer-motion';
import { FileType, Hash } from 'lucide-react';
import { useMail } from '@/contexts/MailContext';

const SettingsPage = () => {
  const { mailClassifications } = useMail();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Pengaturan Klasifikasi Surat</h1>
        <p className="text-gray-600 mt-1">Daftar jenis dan kode surat yang tersedia</p>
      </div>

      {mailClassifications.map(category => (
        <motion.div 
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((type, index) => (
              <motion.div
                key={type.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <FileType className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{type.name}</h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <Hash className="w-3 h-3" />
                        <span>{type.code}</span>
                      </div>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SettingsPage;