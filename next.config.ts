import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ['192.168.56.1', '192.168.56.1:3000', 'localhost', 'localhost:3000'],
} as any;

export default nextConfig;
