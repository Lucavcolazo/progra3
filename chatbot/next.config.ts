import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
  },
};

export default nextConfig;
