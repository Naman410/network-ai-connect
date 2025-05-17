import { createClient } from '@supabase/supabase-js';

// These should be public anon keys, never use service keys in the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log Supabase initialization status
console.log('Supabase client initialized with URL:', supabaseUrl);

// Test Supabase connection
(async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful. Count:', data);
    }
  } catch (err) {
    console.error('Supabase connection test error:', err);
  }
})();

// Helper function to call Supabase Edge Functions
export async function callEdgeFunction(functionName: string, payload: any) {
  try {
    console.log(`Calling Supabase Edge Function: ${functionName}`);
    console.log('Supabase URL:', supabaseUrl);
    console.log('Payload:', payload);

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });

    if (error) {
      console.error(`Supabase Edge Function Error:`, error);
      throw error;
    }

    console.log(`Supabase Edge Function Response:`, data);
    return data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}
