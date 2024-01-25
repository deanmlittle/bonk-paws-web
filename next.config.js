/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@coral-xyz/anchor"],
      },
}

module.exports = nextConfig
