import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Eye, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MailFormDialog from '@/components/dialogs/MailFormDialog';
import MailDetailDialog from '@/components/dialogs/MailDetailDialog';
import { useMail } from '@/contexts/MailContext';
import { useAuth } from '@/contexts/AuthContext';

const OutgoingMailPage = () => {
  const { user } = useAuth();
  const { outgoingMail, addOutgoingMail, updateMail } = useMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const { toast } = useToast();
  
  const effectiveUser = user?.originalUser ? JSON.parse(localStorage.getItem('users')).find(u => u.name === user.originalUser) : user;
  const canCreate = effectiveUser?.canInputOutgoing;

  const handleAdd = (data) => {
    addOutgoingMail(data);
    toast({
      title: "Berhasil! ✅",
      description: "Surat keluar berhasil dibuat dengan nomor otomatis.",
    });
  };

  const handleEdit = (data) => {
    updateMail(selectedMail.id, data, 'outgoing');
    toast({
      title: "Berhasil! ✅",
      description: "Surat keluar berhasil diperbarui.",
    });
  };

  const filteredMails = outgoingMail.filter(mail =>
    mail.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.mailNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Surat Keluar</h1>
          <p className="text-gray-600 mt-1">Kelola surat keluar organisasi</p>
        </div>
        {canCreate && <Button
          onClick={() => {
            setSelectedMail(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Buat Surat Keluar
        </Button>}
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari surat keluar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">No. Surat</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Penerima</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Perihal</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tanggal</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700">File</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMails.map((mail, index) => (
                <motion.tr
                  key={mail.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-sm">{mail.mailNumber}</td>
                  <td className="py-4 px-4">{mail.recipient}</td>
                  <td className="py-4 px-4">{mail.subject}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(mail.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {mail.googleDriveFileUrl ? (
                      <Button variant="ghost" size="icon" onClick={() => window.open(mail.googleDriveFileUrl, '_blank')} title="Buka di Google Drive">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.5,14.5 L10,17 L14,13 L15.5,14.5 L12,18 L8.5,14.5 M16.56,13.97 L18,15.41 L15.59,17.81 L14.16,16.38 L16.56,13.97 M9,3 C9.55,3 10.04,3.16 10.46,3.41 C11.38,4.13 11.88,5.29 11.88,6.62 V9.75 C11.88,11.08 11.38,12.24 10.46,12.96 C10.04,13.21 9.55,13.37 9,13.37 C8.45,13.37 7.96,13.21 7.54,12.96 C6.62,12.24 6.12,11.08 6.12,9.75 V6.62 C6.12,5.29 6.62,4.13 7.54,3.41 C7.96,3.16 8.45,3 9,3 Z"/>
                        </svg>
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center text-orange-600" title="File Google Drive belum dilampirkan">
                        <AlertTriangle className="w-5 h-5"/>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedMail(mail); setIsDetailOpen(true); }} className="hover:bg-purple-100" title="Lihat detail">
                        <Eye className="w-4 h-4" />
                      </Button>
                       {canCreate && (
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedMail(mail); setIsFormOpen(true); }} className="hover:bg-blue-100" title="Edit surat">
                          <Edit className="w-4 h-4" />
                        </Button>
                       )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredMails.length === 0 && (
            <div className="text-center py-12">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <img class="w-40 h-40 mx-auto text-gray-300" alt="Empty mailbox illustration" src="https://images.unsplash.com/photo-1613288054365-3150792e26b7" />
                  <p className="mt-4 text-gray-500">Belum ada surat keluar yang dibuat.</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <MailFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedMail ? handleEdit : handleAdd}
        initialData={selectedMail}
        type="outgoing"
      />

      <MailDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        mail={selectedMail}
      />
    </div>
  );
};

export default OutgoingMailPage;