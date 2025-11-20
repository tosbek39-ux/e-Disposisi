import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const DispositionFormDialog = ({ open, onOpenChange, onSubmit, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    recipient: '',
    instruction: '',
    status: 'pending'
  });
  const [dispositionTargets, setDispositionTargets] = useState([]);

  useEffect(() => {
    if (!open || !user) return;
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let targets = [];
    
    const currentUserRole = user.originalUser ? allUsers.find(u => u.name === user.originalUser)?.role : user.role;

    if (currentUserRole) {
      if (currentUserRole === 'kasub_umum') {
        targets = allUsers.filter(u => u.role === 'kpa' || u.role === 'sekretaris');
      } else if (currentUserRole === 'kpa') {
        targets = allUsers.filter(u => u.role === 'sekretaris' || u.role === 'panitera');
      } else if (currentUserRole === 'sekretaris') {
         targets = allUsers.filter(u => u.role === 'kasub');
      } else if (currentUserRole === 'panitera') {
         targets = allUsers.filter(u => u.role === 'panmud');
      } else if (currentUserRole === 'kasub' || currentUserRole === 'panmud') {
         const currentUserPath = user.originalUser ? allUsers.find(u => u.name === user.originalUser)?.path : user.path;
         targets = allUsers.filter(u => u.path.startsWith(currentUserPath + '.') && u.role === 'pelaksana');
      } else if (currentUserRole === 'superadmin') {
        targets = allUsers.filter(u => u.id !== user.id);
      }
    }
    
    setDispositionTargets(targets);

    if (initialData) {
      setFormData({
        recipient: initialData.recipientId || '',
        instruction: initialData.instruction || '',
        status: initialData.status || 'pending',
      });
    } else {
       setFormData({ recipient: '', instruction: '', status: 'pending' });
    }
  }, [user, open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const recipientUser = allUsers.find(u => u.id === formData.recipient);
    onSubmit({ ...formData, recipientName: recipientUser ? recipientUser.name : '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">
            Arahkan / Update Disposisi
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Arahkan Ke</Label>
            <Select
              value={formData.recipient}
              onValueChange={(value) => setFormData({ ...formData, recipient: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tujuan disposisi" />
              </SelectTrigger>
              <SelectContent>
                {dispositionTargets.map(p => (
                   <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

           <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="process">Diproses</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <div className="space-y-2">
            <Label>Instruksi / Catatan</Label>
            <Textarea
              value={formData.instruction}
              onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
              placeholder="Instruksi atau catatan..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DispositionFormDialog;