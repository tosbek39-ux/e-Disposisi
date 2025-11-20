import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, FileText, FileArchive, CheckCircle2 } from 'lucide-react';
import GoogleDriveViewer from '@/components/ui/google-drive-viewer';

const MailDetailDialog = ({ open, onOpenChange, mail }) => {
  if (!mail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Detail Surat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {mail.type === 'outgoing' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileArchive className="w-4 h-4" />
                <span className="font-medium">Nomor Surat</span>
              </div>
              <p className="font-semibold text-gray-800">{mail.mailNumber}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">{mail.type === 'incoming' ? 'Pengirim' : 'Penerima'}</span>
              </div>
              <p className="font-semibold">{mail.sender || mail.recipient}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{mail.type === 'incoming' ? 'Tanggal Diterima' : 'Tanggal Surat'}</span>
              </div>
              <p className="font-semibold">{new Date(mail.receivedDate || mail.date).toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Perihal</span>
            </div>
            <p className="font-semibold">{mail.subject}</p>
          </div>

          {mail.googleDriveFileUrl ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-medium">File Surat</span>
              </div>
              <GoogleDriveViewer 
                fileUrl={mail.googleDriveFileUrl}
                fileName={mail.subject || 'File Surat'}
                height="400px"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Isi Ringkas</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{mail.content}</p>
              </div>
            </div>
          )}

          {mail.type === 'outgoing' && mail.uploaded && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-sm font-medium">
                File surat telah diunggah: <span className="font-semibold">{mail.fileName}</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MailDetailDialog;