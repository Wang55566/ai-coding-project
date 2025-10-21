import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
