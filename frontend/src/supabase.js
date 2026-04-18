import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxeaplzfgydytostlvmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZWFwbHpmZ3lkeXRvc3Rsdm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODE1MzMsImV4cCI6MjA5MTU1NzUzM30.rdITJUsZwc-kX029j39TiyMDlTEYyPtUF1xsrBPli3s';

export const supabase = createClient(supabaseUrl, supabaseKey);