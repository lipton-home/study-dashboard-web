import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: false,
    env: {
        API_BASE_URL: process.env.API_BASE_URL ?? 'localhost:8080/api',
    },
};

interface ApiConfig {
    env:{
        API_BASE_URL: string,
    }
}

export default nextConfig as ApiConfig;

