/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@coral-xyz/anchor", "@solana/spl-token"],
      },
}

module.exports = nextConfig
