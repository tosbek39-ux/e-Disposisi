import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useMail } from '@/contexts/MailContext';
import GoogleDriveInput from '@/components/ui/google-drive-input';

const MailFormDialog = ({ open, onOpenChange, onSubmit, initialData, type }) => {
  const { mailClassifications } = useMail();
  const [formData, setFormData] = useState({});
  const [signatories, setSignatories] = useState([]);
  const [initialRecipients, setInitialRecipients] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setSignatories([
        { signCode: 'KPA', name: 'Ketua Pengadilan Agama' },
        { signCode: 'SEK.PA', name: 'Sekretaris Pengadilan Agama' },
        { signCode: 'SEK.01', name: 'Kasub PTIP' },
        { signCode: 'SEK.02', name: 'Kepegawaian Ortala' },
        { signCode: 'SEK.03', name: 'Umum dan Keuangan' },
        { signCode: 'PAN.PTA', name: 'Panitera Pengadilan Agama' },
        { signCode: 'PAN.01', name: 'Panitera Muda Permohonan' },
        { signCode: 'PAN.02', name: 'Panitera Muda Gugatan' },
        { signCode: 'PAN.03', name: 'Panitera Muda Hukum' },
    ]);
    setInitialRecipients(users.filter(u => u.role === 'kpa' || u.role === 'sekretaris'));
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(
        type === 'incoming'
          ? {
              sender: '',
              subject: '',
              receivedDate: new Date().toISOString().split('T')[0],
              mailDate: '',
              googleDriveFileUrl: '',
              classificationCode: '',
              initialRecipientId: ''
            }
          : {
              recipient: '',
              subject: '',
              date: new Date().toISOString().split('T')[0],
              googleDriveFileUrl: '',
              signatory: '',
              classificationCode: ''
            }
      );
    }
  }, [initialData, open, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const renderIncomingForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label>Tanggal Diterima</Label>
            <Input type="date" value={formData.receivedDate} onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })} required />
         </div>
         <div className="space-y-2">
            <Label>Tanggal Surat</Label>
            <Input type="date" value={formData.mailDate} onChange={(e) => setFormData({ ...formData, mailDate: e.target.value })} required />
         </div>
      </div>
      <div className="space-y-2">
        <Label>Pengirim</Label>
        <Input value={formData.sender} onChange={(e) => setFormData({ ...formData, sender: e.target.value })} placeholder="Nama pengirim" required />
      </div>
      <div className="space-y-2">
        <Label>Klasifikasi Surat</Label>
        <Select value={formData.classificationCode} onValueChange={(value) => setFormData({ ...formData, classificationCode: value })} required>
          <SelectTrigger><SelectValue placeholder="Pilih klasifikasi..." /></SelectTrigger>
          <SelectContent className="max-h-64">
            {mailClassifications.map(cat => (
              <SelectGroup key={cat.category}>
                <SelectLabel>{cat.category}</SelectLabel>
                {cat.items.map(item => <SelectItem key={item.code} value={item.code}>{item.code} - {item.name}</SelectItem>)}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Perihal</Label>
        <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Perihal surat" required />
      </div>
      <div className="space-y-2">
        <GoogleDriveInput
          label="File Surat (Google Drive)"
          value={formData.googleDriveFileUrl}
          onChange={(value) => setFormData({ ...formData, googleDriveFileUrl: value })}
          placeholder="Masukkan URL Google Drive file surat..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Tujuan Disposisi Awal</Label>
        <Select value={formData.initialRecipientId} onValueChange={(value) => setFormData({ ...formData, initialRecipientId: value })} required>
          <SelectTrigger><SelectValue placeholder="Pilih tujuan awal..." /></SelectTrigger>
          <SelectContent>
            {initialRecipients.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderOutgoingForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pejabat Penanda Tangan</Label>
           <Select value={formData.signatory} onValueChange={(value) => setFormData({ ...formData, signatory: value })} required>
              <SelectTrigger><SelectValue placeholder="Pilih pejabat" /></SelectTrigger>
              <SelectContent>
                {signatories.map((s) => <SelectItem key={s.signCode} value={s.signCode}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Tanggal Surat</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Klasifikasi Surat</Label>
        <Select value={formData.classificationCode} onValueChange={(value) => setFormData({ ...formData, classificationCode: value })} required>
          <SelectTrigger><SelectValue placeholder="Pilih klasifikasi..." /></SelectTrigger>
          <SelectContent className="max-h-64">
            {mailClassifications.map(cat => (
              <SelectGroup key={cat.category}>
                <SelectLabel>{cat.category}</SelectLabel>
                {cat.items.map(item => <SelectItem key={item.code} value={item.code}>{item.code} - {item.name}</SelectItem>)}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
       <div className="space-y-2">
        <Label>Penerima</Label>
        <Input value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} placeholder="Tujuan surat" required />
      </div>
      <div className="space-y-2">
        <Label>Perihal</Label>
        <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Perihal surat" required />
      </div>
      <div className="space-y-2">
        <GoogleDriveInput
          label="File Surat (Google Drive)"
          value={formData.googleDriveFileUrl}
          onChange={(value) => setFormData({ ...formData, googleDriveFileUrl: value })}
          placeholder="Masukkan URL Google Drive file surat..."
          required
        />
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">
            {initialData ? 'Edit' : 'Tambah'} Surat {type === 'incoming' ? 'Masuk' : 'Keluar'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'incoming' ? renderIncomingForm() : renderOutgoingForm()}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600">{initialData ? 'Perbarui' : 'Simpan'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MailFormDialog;