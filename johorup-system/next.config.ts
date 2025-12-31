import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production with Vercel
  reactStrictMode: true,
  
  // Remove static export - use server-side rendering
  // output: 'export',
  // trailingSlash: true,
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'JohorUP Dashboard',
  },
};

export default nextConfig;
