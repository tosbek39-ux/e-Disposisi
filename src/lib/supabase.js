import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ucknstdgnrmbexetwrzc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja25zdGRnbnJtYmV4ZXR3cnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTE3MDMsImV4cCI6MjA3OTIyNzcwM30.CDAJHd_cn71UyYMFoxmWh9gN7LRY4Dhgz8Ank-CLO80';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.log('Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
} else {
  console.log('✅ Supabase configured:', supabaseUrl);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // We'll handle auth manually
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  }
});

// Export configuration for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : 'Not set',
  enabled: Boolean(supabaseUrl && supabaseAnonKey)
};

console.log('🔧 Supabase Config:', supabaseConfig);