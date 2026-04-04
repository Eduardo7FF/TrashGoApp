import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://fyfyzvscttynrubbablm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Znl6dnNjdHR5bnJ1YmJhYmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mzc3NzMsImV4cCI6MjA4OTUxMzc3M30.swrymNF9BJm485_Yn9ZHJ0C3DjzdBDqWNO2KOteAh40';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
