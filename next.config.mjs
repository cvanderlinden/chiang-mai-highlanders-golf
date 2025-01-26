/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                child_process: false,
                net: false,
                tls: false,
                dns: false,
                timers: false,
                'timers/promises': false,
                kerberos: false,
            };
        }
        return config;
    },
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    output: 'standalone', // Optimizes for deployment
    poweredByHeader: false, // Optional: Security enhancement by hiding "X-Powered-By"
    headers: async () => [
        {
            source: '/_next/static/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable',
                },
            ],
        },
        {
            source: '/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, must-revalidate',
                },
            ],
        },
    ],
};

export default nextConfig;
