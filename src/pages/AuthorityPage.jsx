import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Repeat, Save, UserX, User, Mail, Send, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AuthorityPage = () => {
    const { updateUserAuthority, updateUserPermissions } = useAuth();
    const [users, setUsers] = useState([]);
    const [authorityChanges, setAuthorityChanges] = useState({});
    const { toast } = useToast();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
        const initialChanges = storedUsers.reduce((acc, user) => {
            acc[user.id] = { 
                onLeave: user.onLeave || false, 
                substitute: user.substitute || '',
                canInputIncoming: user.canInputIncoming || false,
                canInputOutgoing: user.canInputOutgoing || false,
            };
            return acc;
        }, {});
        setAuthorityChanges(initialChanges);
    }, []);

    const handleFieldChange = (userId, field, value) => {
        setAuthorityChanges(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };
    
    const handleSave = (userId) => {
        const { onLeave, substitute, canInputIncoming, canInputOutgoing } = authorityChanges[userId];
        const authorityResult = updateUserAuthority(userId, onLeave, onLeave ? substitute : null);
        const permissionResult = updateUserPermissions(userId, canInputIncoming, canInputOutgoing);

        if(authorityResult.success && permissionResult.success) {
            toast({
                title: "Berhasil Disimpan! ✅",
                description: `Pengaturan otoritas & hak akses untuk user telah diperbarui.`,
            });
            // Refresh users from localStorage
            setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
        } else {
             toast({
                title: "Gagal Menyimpan",
                description: authorityResult.error || permissionResult.error,
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Peralihan Otoritas & Hak Akses</h1>
                <p className="text-gray-600 mt-1">Atur pengganti sementara dan hak akses input surat untuk setiap user.</p>
            </div>

            <div className="space-y-4">
                {users.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-effect rounded-2xl p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status Cuti</label>
                                     <Select 
                                        value={authorityChanges[user.id]?.onLeave ? 'true' : 'false'}
                                        onValueChange={(val) => handleFieldChange(user.id, 'onLeave', val === 'true')}
                                     >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="false"><div className="flex items-center"><UserCheck className="w-4 h-4 mr-2"/> Aktif</div></SelectItem>
                                            <SelectItem value="true"><div className="flex items-center"><UserX className="w-4 h-4 mr-2"/> Cuti</div></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                     <label className="text-sm font-medium">Digantikan Oleh</label>
                                      <Select
                                        value={authorityChanges[user.id]?.substitute || ''}
                                        onValueChange={(val) => handleFieldChange(user.id, 'substitute', val)}
                                        disabled={!authorityChanges[user.id]?.onLeave}
                                      >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Pengganti"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.filter(u => u.id !== user.id).map(substitute => (
                                                <SelectItem key={substitute.id} value={substitute.id}>
                                                    <div className="flex items-center"><User className="w-4 h-4 mr-2"/>{substitute.name}</div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hak Akses Input</label>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm" className="justify-start" onClick={() => handleFieldChange(user.id, 'canInputIncoming', !authorityChanges[user.id]?.canInputIncoming)}>
                                            {authorityChanges[user.id]?.canInputIncoming ? <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> : <Square className="w-4 h-4 mr-2" />}
                                            <Mail className="w-4 h-4 mr-2" /> Surat Masuk
                                        </Button>
                                         <Button variant="outline" size="sm" className="justify-start" onClick={() => handleFieldChange(user.id, 'canInputOutgoing', !authorityChanges[user.id]?.canInputOutgoing)}>
                                            {authorityChanges[user.id]?.canInputOutgoing ? <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> : <Square className="w-4 h-4 mr-2" />}
                                            <Send className="w-4 h-4 mr-2" /> Surat Keluar
                                        </Button>
                                    </div>
                                </div>

                                <Button onClick={() => handleSave(user.id)} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AuthorityPage;