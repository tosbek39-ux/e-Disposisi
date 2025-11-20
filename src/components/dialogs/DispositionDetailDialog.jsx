import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, FileText, ChevronsRight, Clock } from 'lucide-react';

const DispositionDetailDialog = ({ open, onOpenChange, disposition }) => {
  if (!disposition) return null;

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'process': return 'Diproses';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Detail Disposisi</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Perihal Surat</span>
            </div>
            <p className="font-semibold">{disposition.mailNumber}</p>
          </div>
          
           <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Status</span>
            </div>
             <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {getStatusLabel(disposition.status)}
              </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Riwayat Disposisi</p>
            <div className="space-y-4 border-l-2 border-gray-200 pl-4">
              {disposition.history && disposition.history.length > 0 ? disposition.history.map((h, index) => (
                <div key={index} className="relative">
                   <div className="absolute -left-[23px] top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                   <p className="font-semibold text-sm">{h.from} <ChevronsRight className="inline w-4 h-4 text-gray-400"/> {h.to}</p>
                   <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString('id-ID')}</p>
                   <blockquote className="mt-2 border-l-4 border-gray-300 pl-3 text-sm italic">"{h.instruction}"</blockquote>
                </div>
              )) : (
                <p className="text-sm text-gray-500">Belum ada riwayat.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispositionDetailDialog;