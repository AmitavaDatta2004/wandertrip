
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkpmckpmdqryfnxtzoms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrcG1ja3BtZHFyeWZueHR6b21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTg4MjksImV4cCI6MjA2MTE3NDgyOX0.7thnhvp7PAf5pVTPH4dAwR5uDIFFxTqO3vgjQJEU30s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
