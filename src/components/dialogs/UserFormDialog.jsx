import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserFormDialog = ({ open, onOpenChange, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'pelaksana',
    signCode: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' });
    } else {
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 'pelaksana',
        signCode: ''
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.password && initialData) {
      // Keep old password if not changed
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const oldUser = users.find(u => u.id === initialData.id);
      submitData.password = oldUser.password;
    }
    onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">
            {initialData ? 'Edit' : 'Tambah'} User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap" required />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Username" required />
          </div>
          <div className="space-y-2">
            <Label>Password {initialData && '(kosongkan jika tidak diubah)'}</Label>
            <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" required={!initialData} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="pimpinan">Pimpinan</SelectItem>
                <SelectItem value="pelaksana">Staf Pelaksana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.role === 'pimpinan' && <div className="space-y-2">
            <Label>Kode Penanda Tangan (e.g., KPA, SEK)</Label>
            <Input value={formData.signCode} onChange={(e) => setFormData({ ...formData, signCode: e.target.value.toUpperCase() })} placeholder="KPA" required={formData.role === 'pimpinan'} />
          </div>}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">{initialData ? 'Perbarui' : 'Simpan'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;