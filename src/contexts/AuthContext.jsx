import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultUsers = [
        { id: '1', username: 'kpa', password: 'password', name: 'Ketua Pengadilan Agama', role: 'kpa', signCode: 'KPA', onLeave: false, substitute: null, path: 'kpa', canInputIncoming: false, canInputOutgoing: false },
        { id: '2', username: 'sekretaris', password: 'password', name: 'Sekretaris', role: 'sekretaris', signCode: 'SEK', onLeave: false, substitute: null, path: 'kpa.sekretaris', canInputIncoming: false, canInputOutgoing: false },
        { id: '3', username: 'panitera', password: 'password', name: 'Panitera', role: 'panitera', signCode: 'PAN', onLeave: false, substitute: null, path: 'kpa.panitera', canInputIncoming: false, canInputOutgoing: false },
        { id: '4', username: 'kasub_umum', password: 'password', name: 'Kasub Umum Keuangan', role: 'kasub_umum', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_umum', canInputIncoming: true, canInputOutgoing: false },
        { id: '5', username: 'kasub_kepeg', password: 'password', name: 'Kasub Kepegawaian', role: 'kasub', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_kepeg', canInputIncoming: false, canInputOutgoing: false },
        { id: '6', username: 'kasub_ptip', password: 'password', name: 'Kasub PTIP', role: 'kasub', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_ptip', canInputIncoming: false, canInputOutgoing: false },
        { id: '7', username: 'panmud_gugatan', password: 'password', name: 'Panitera Muda Gugatan', role: 'panmud', onLeave: false, substitute: null, path: 'kpa.panitera.panmud_gugatan', canInputIncoming: false, canInputOutgoing: false },
        { id: '8', username: 'panmud_hukum', password: 'password', name: 'Panitera Muda Hukum', role: 'panmud', onLeave: false, substitute: null, path: 'kpa.panitera.panmud_hukum', canInputIncoming: false, canInputOutgoing: false },
        { id: '9', username: 'panmud_permohonan', password: 'password', name: 'Panitera Muda Permohonan', role: 'panmud', onLeave: false, substitute: null, path: 'kpa.panitera.panmud_permohonan', canInputIncoming: false, canInputOutgoing: false },
        { id: '10', username: 'pelaksana_umum', password: 'password', name: 'Staf Pelaksana Umum', role: 'pelaksana', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_umum.pelaksana', canInputIncoming: false, canInputOutgoing: true },
        { id: '11', username: 'pelaksana_kepeg', password: 'password', name: 'Staf Pelaksana Kepegawaian', role: 'pelaksana', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_kepeg.pelaksana', canInputIncoming: false, canInputOutgoing: false },
        { id: '12', username: 'pelaksana_ptip', password: 'password', name: 'Staf Pelaksana PTIP', role: 'pelaksana', onLeave: false, substitute: null, path: 'kpa.sekretaris.kasub_ptip.pelaksana', canInputIncoming: false, canInputOutgoing: false },
        { id: '13', username: 'pelaksana_gugatan', password: 'password', name: 'Staf Pelaksana Gugatan', role: 'pelaksana', onLeave: false, substitute: null, path: 'kpa.panitera.panmud_gugatan.pelaksana', canInputIncoming: false, canInputOutgoing: false },
        { id: '14', username: 'superadmin', password: 'admin', name: 'Super Admin', role: 'superadmin', onLeave: false, substitute: null, path: 'superadmin', canInputIncoming: true, canInputOutgoing: true },
    ];
    
    const usersInStorage = localStorage.getItem('users');
    if (!usersInStorage) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    } else {
      // Ensure existing users have new properties and superadmin has updated password
      let users = JSON.parse(usersInStorage);
      const updatedUsers = users.map(user => {
        if (user.username === 'superadmin') {
          return {
            ...user,
            password: 'admin', // Update superadmin password here
            canInputIncoming: user.canInputIncoming !== undefined ? user.canInputIncoming : true,
            canInputOutgoing: user.canInputOutgoing !== undefined ? user.canInputOutgoing : true,
          };
        }
        return {
          ...user,
          canInputIncoming: user.canInputIncoming !== undefined ? user.canInputIncoming : (user.role === 'superadmin' || user.role === 'kasub_umum'),
          canInputOutgoing: user.canInputOutgoing !== undefined ? user.canInputOutgoing : (user.role === 'superadmin' || user.role === 'pelaksana'),
        };
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      if (foundUser.onLeave && foundUser.substitute) {
        const substituteUser = users.find(u => u.id === foundUser.substitute);
        if (substituteUser) {
          const effectiveUser = { ...substituteUser, originalUser: foundUser.name, canInputIncoming: foundUser.canInputIncoming, canInputOutgoing: foundUser.canInputOutgoing };
          setUser(effectiveUser);
          localStorage.setItem('currentUser', JSON.stringify(effectiveUser));
          return { success: true, message: `Login sebagai ${substituteUser.name} (pengganti ${foundUser.name})` };
        }
      }
      
      const userToLogin = { ...foundUser };
      delete userToLogin.password;
      setUser(userToLogin);
      localStorage.setItem('currentUser', JSON.stringify(userToLogin));
      return { success: true };
    }
    return { success: false, error: 'Username atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const updateUserAuthority = (userId, onLeave, substituteId) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].onLeave = onLeave;
      users[userIndex].substitute = onLeave ? substituteId : null;
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: "User tidak ditemukan" };
  };

  const updateUserPermissions = (userId, canInputIncoming, canInputOutgoing) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].canInputIncoming = canInputIncoming;
      users[userIndex].canInputOutgoing = canInputOutgoing;
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: "User tidak ditemukan" };
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUserAuthority,
    updateUserPermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;