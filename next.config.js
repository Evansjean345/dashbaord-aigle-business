/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MARCHAND_URL: process.env.NEXT_PUBLIC_MARCHAND_URL,
    NEXT_PUBLIC_USERNAME_MTARGET: process.env.NEXT_PUBLIC_USERNAME_MTARGET,
    NEXT_PUBLIC_PASSWORD_MTARGET: process.env.NEXT_PUBLIC_PASSWORD_MTARGET,
    NEXT_PUBLIC_SENDER_MTARGET: process.env.NEXT_PUBLIC_SENDER_MTARGET,
  },
};

module.exports = nextConfig;
