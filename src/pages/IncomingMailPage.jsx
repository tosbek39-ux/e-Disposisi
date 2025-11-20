import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Calendar, FileText, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MailFormDialog from '@/components/dialogs/MailFormDialog';
import MailDetailDialog from '@/components/dialogs/MailDetailDialog';
import { useMail } from '@/contexts/MailContext';
import { useAuth } from '@/contexts/AuthContext';

const IncomingMailPage = () => {
  const { incomingMail, addIncomingMail, updateMail } = useMail();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const { toast } = useToast();
  
  const effectiveUser = user?.originalUser ? JSON.parse(localStorage.getItem('users')).find(u => u.name === user.originalUser) : user;
  const canManage = effectiveUser?.canInputIncoming;

  const handleAdd = (data) => {
    addIncomingMail(data);
    toast({
      title: "Berhasil! ✅",
      description: "Surat masuk berhasil ditambahkan dan disposisi dibuat.",
    });
  };

  const handleEdit = (data) => {
    updateMail(selectedMail.id, data, 'incoming');
    toast({
      title: "Berhasil! ✅",
      description: "Surat masuk berhasil diperbarui.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Fitur Dalam Pengembangan 🚧",
      description: "Penghapusan surat akan diimplementasikan.",
    });
  };

  const filteredMails = incomingMail.filter(mail =>
    mail.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.agendaNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Surat Masuk</h1>
          <p className="text-gray-600 mt-1">Kelola surat masuk organisasi</p>
        </div>
        {canManage && <Button
          onClick={() => {
            setSelectedMail(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Surat
        </Button>}
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari surat masuk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">No. Agenda</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Pengirim</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Perihal</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tanggal Terima</th>
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
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{mail.agendaNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{mail.sender}</td>
                  <td className="py-4 px-4">{mail.subject}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(mail.receivedDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                   <td className="py-4 px-4 text-center">
                    {mail.googleDriveFileUrl ? (
                      <Button variant="ghost" size="icon" onClick={() => window.open(mail.googleDriveFileUrl, '_blank')} title="Buka di Google Drive">
                        <FileDown className="w-5 h-5 text-blue-600"/>
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center text-orange-600" title="File Google Drive belum dilampirkan">
                        <AlertTriangle className="w-5 h-5"/>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedMail(mail); setIsDetailOpen(true); }} className="hover:bg-blue-100" title="Lihat Detail">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canManage && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedMail(mail); setIsFormOpen(true); }} className="hover:bg-purple-100" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(mail.id)} className="hover:bg-red-100 text-red-600" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredMails.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Belum ada surat masuk</p>
            </div>
          )}
        </div>
      </div>

      <MailFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedMail ? handleEdit : handleAdd}
        initialData={selectedMail}
        type="incoming"
      />

      <MailDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        mail={selectedMail}
      />
    </div>
  );
};

export default IncomingMailPage;