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
};

export default nextConfig;
