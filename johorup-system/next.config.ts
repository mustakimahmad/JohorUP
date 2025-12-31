import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production with Netlify
  reactStrictMode: true,
  
  // Remove static export to enable API routes and functions
  // output: 'export', // Disabled to enable functions
  trailingSlash: false,
  
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
