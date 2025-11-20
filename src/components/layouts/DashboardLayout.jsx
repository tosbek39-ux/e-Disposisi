import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Mail, 
  Send, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import DashboardPage from '@/pages/DashboardPage';
import IncomingMailPage from '@/pages/IncomingMailPage';
import OutgoingMailPage from '@/pages/OutgoingMailPage';
import DispositionPage from '@/pages/DispositionPage';
import UsersPage from '@/pages/UsersPage';
import SettingsPage from '@/pages/SettingsPage';
import AuthorityPage from '@/pages/AuthorityPage';

const DashboardLayout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  
  const isAdminOrSuperAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incoming', label: 'Surat Masuk', icon: Mail },
    { id: 'outgoing', label: 'Surat Keluar', icon: Send },
    { id: 'disposition', label: 'Disposisi', icon: FileText },
    ...(isAdminOrSuperAdmin ? [
      { id: 'users', label: 'Kelola User', icon: Users },
      { id: 'authority', label: 'Peralihan Otoritas', icon: UserCheck },
      { id: 'settings', label: 'Klasifikasi Surat', icon: Settings }
    ] : [])
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'incoming': return <IncomingMailPage />;
      case 'outgoing': return <OutgoingMailPage />;
      case 'disposition': return <DispositionPage />;
      case 'users': return <UsersPage />;
      case 'authority': return <AuthorityPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 w-72 h-screen glass-effect border-r border-gray-200"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold gradient-text">Disposisi</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </motion.button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200">
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="glass-effect border-b border-gray-200 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;