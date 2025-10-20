import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
};

export default nextConfig;
