import { createClient } from '@supabase/supabase-js';

// These should be public anon keys, never use service keys in the browser
// Fallback to hardcoded values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qxufzbrkouhznesqpawq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dWZ6YnJrb3Voem5lc3FwYXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjM5ODYsImV4cCI6MjA2MzAzOTk4Nn0.Xqx__FOt9N1K1o7brTETWtHbQ0ljgOTSes7qrvLJkx8';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Environment mode:', import.meta.env.MODE);

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
    console.log('Environment:', import.meta.env.MODE);

    // Don't log the full payload as it might be large
    console.log('Payload summary:', {
      answersLength: payload.answers?.length,
      profilesCount: payload.profiles?.length
    });

    // Check if we're in a Lovable environment
    const isLovable = typeof window !== 'undefined' &&
      (window.location.hostname.includes('lovable.dev') ||
       document.referrer.includes('lovable.dev'));

    if (isLovable) {
      console.log('Lovable environment detected, attempting to use mock data');
      try {
        const response = await fetch('/api/match');
        if (response.ok) {
          const mockData = await response.json();
          console.log('Using mock data instead of edge function');
          return mockData;
        }
      } catch (mockError) {
        console.warn('Failed to load mock data:', mockError);
      }
    }

    // Proceed with actual edge function call
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });

    if (error) {
      console.error(`Supabase Edge Function Error:`, error);
      throw error;
    }

    console.log(`Supabase Edge Function Response received`);
    if (data?.matches) {
      console.log(`Received ${data.matches.length} matches`);
    }

    return data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}
