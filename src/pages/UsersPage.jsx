import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UserFormDialog from '@/components/dialogs/UserFormDialog';
import { useAuth } from '@/contexts/AuthContext';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();
  
  const canManage = currentUser?.role === 'superadmin';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const stored = localStorage.getItem('users');
    setUsers(stored ? JSON.parse(stored) : []);
  };

  const saveUsers = (newUsers) => {
    localStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const handleAdd = (data) => {
    const newUser = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    saveUsers([...users, newUser]);
    toast({
      title: "Berhasil! ✅",
      description: "User berhasil ditambahkan",
    });
  };

  const handleEdit = (data) => {
    const updated = users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u);
    saveUsers(updated);
    toast({
      title: "Berhasil! ✅",
      description: "User berhasil diperbarui",
    });
  };

  const handleDelete = (id) => {
    saveUsers(users.filter(u => u.id !== id));
    toast({
      title: "Berhasil! ✅",
      description: "User berhasil dihapus",
    });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRoleLabel = (role) => {
    const roles = {
        'pimpinan': 'Pimpinan',
        'pelaksana': 'Staf Pelaksana',
        'superadmin': 'Super Admin',
        'admin': 'Admin'
    };
    return roles[role] || role;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Kelola User</h1>
          <p className="text-gray-600 mt-1">Manajemen user dan hak akses</p>
        </div>
        {canManage && <Button
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah User
        </Button>}
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                {(user.role === 'superadmin' || user.role === 'admin') && (
                  <Shield className="w-5 h-5 text-indigo-500" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'superadmin' 
                    ? 'bg-red-100 text-red-700' 
                    : user.role === 'pimpinan'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {canManage && <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsFormOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>}
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada user</p>
          </div>
        )}
      </div>

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedUser ? handleEdit : handleAdd}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UsersPage;