export const UrlsConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  r2PublicUrl: import.meta.env.VITE_R2_PUBLIC_URL || '',
  appDomain: 'abihaniexpress.com.ng',
  contactEmail: 'abihaniexpress@gmail.com',
} as const;
