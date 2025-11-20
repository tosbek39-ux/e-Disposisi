import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Calendar, User, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DispositionFormDialog from '@/components/dialogs/DispositionFormDialog';
import DispositionDetailDialog from '@/components/dialogs/DispositionDetailDialog';
import { useMail } from '@/contexts/MailContext';
import { useAuth } from '@/contexts/AuthContext';

const DispositionPage = () => {
  const { user } = useAuth();
  const { dispositions, updateDisposition } = useMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState(null);
  const { toast } = useToast();
  
  const handleUpdate = (data) => {
    let history = selectedDisposition.history || [];
    let currentRecipientName = selectedDisposition.recipientName || 'Staf Pelaksana';

    if (data.recipientName) {
      history.push({
        from: user.name,
        to: data.recipientName,
        timestamp: new Date().toISOString(),
        instruction: data.instruction
      });
      currentRecipientName = data.recipientName;
    }

    updateDisposition(selectedDisposition.id, { 
      ...selectedDisposition, 
      ...data, 
      recipientName: currentRecipientName,
      history 
    });
    toast({
      title: "Berhasil! ✅",
      description: "Disposisi berhasil diarahkan/diperbarui.",
    });
  };
  
  const canDirectDisposition = (disp) => {
      if (user.role === 'superadmin') return true;
      if (!disp.recipientId) { 
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const kasubUmum = users.find(u => u.role === 'kasub_umum');
        return user.id === kasubUmum.id;
      }
      return user.id === disp.recipientId;
  }

  const [visibleDispositions, setVisibleDispositions] = useState([]);

  useEffect(() => {
    if (user) {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const subordinates = allUsers.filter(u => u.path.startsWith(user.path + '.') && u.path.split('.').length === user.path.split('.').length + 1);
        const subordinateIds = subordinates.map(s => s.id);
        
        const filtered = dispositions.filter(disp => {
            const isRecipient = disp.recipientId === user.id;
            const isSender = disp.history?.some(h => h.fromId === user.id);
            const isForSubordinate = subordinateIds.includes(disp.recipientId);

            if (user.role === 'superadmin' || user.role === 'kpa') {
                return true;
            }

            return isRecipient || isSender || isForSubordinate;
        });

        const searchFiltered = filtered.filter(disp =>
            (disp.mailNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disp.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disp.instruction?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setVisibleDispositions(searchFiltered);
    }
  }, [dispositions, user, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'process': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'process': return 'Diproses';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Disposisi Surat</h1>
          <p className="text-gray-600 mt-1">Kelola disposisi dan arahan surat</p>
        </div>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari disposisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Perihal Surat</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tujuan Terakhir</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tanggal</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleDispositions.map((disp, index) => (
                <motion.tr
                  key={disp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{disp.mailNumber}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-500" />
                      <span>{disp.recipientName || 'Belum diarahkan'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(disp.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(disp.status)}`}>
                      {getStatusLabel(disp.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedDisposition(disp); setIsDetailOpen(true); }} className="hover:bg-green-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canDirectDisposition(disp) && (
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedDisposition(disp); setIsFormOpen(true); }} className="hover:bg-blue-100">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {visibleDispositions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Tidak ada disposisi untuk Anda</p>
            </div>
          )}
        </div>
      </div>

      <DispositionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleUpdate}
        initialData={selectedDisposition}
      />

      <DispositionDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        disposition={selectedDisposition}
      />
    </div>
  );
};

export default DispositionPage;