/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['etherscan.io', 'bscscan.com', 'solscan.io', 'dexscreener.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    NEXT_PUBLIC_BSCSCAN_API_KEY: process.env.NEXT_PUBLIC_BSCSCAN_API_KEY,
  },
};

module.exports = nextConfig;