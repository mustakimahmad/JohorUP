import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone for Netlify
  // output: 'standalone',
  
  // Optimize for production
  reactStrictMode: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: true, // For demo without image optimization
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'JohorUP Dashboard',
  },
  
  // Netlify specific
  distDir: '.next',
};

export default nextConfig;
