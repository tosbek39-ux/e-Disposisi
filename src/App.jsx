import React from 'react';
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
          <AppRouter />
          <Toaster />
        </MailProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;