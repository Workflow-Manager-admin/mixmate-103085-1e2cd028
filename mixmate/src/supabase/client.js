/**
 * Supabase client configuration for MixMate
 * 
 * This file exports a configured Supabase client that connects to your 
 * Supabase project using environment variables.
 * 
 * Required environment variables:
 * - REACT_APP_SUPABASE_URL: Your Supabase project URL
 * - REACT_APP_SUPABASE_ANON_KEY: Your Supabase project anonymous key
 * 
 * @module supabase/client
 */
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are defined in your .env file.'
  );
}

/**
 * Singleton Supabase client instance
 * Use this instance throughout the application to interact with your Supabase project
 * 
 * @example
 * // Import and use the client
 * import { supabase } from '../supabase/client';
 * 
 * // Query data
 * const { data } = await supabase.from('cocktails').select('*');
 */
// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
