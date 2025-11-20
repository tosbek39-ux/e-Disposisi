import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/contexts/AuthContext';
import AppRouter from '@/components/AppRouter';
import MailProvider from '@/contexts/MailContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MailProvider>
          <Helmet>
            <title>E-Disposisi Pengadilan Agama Solok</title>
            <meta name="description" content="Aplikasi E-Disposisi untuk Pengadilan Agama Solok." />
          </Helmet>
          <AppRouter />
          <Toaster />
        </MailProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;