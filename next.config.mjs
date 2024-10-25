/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'picsum.photos'],
    },
    experimental: {
        images: {
            allowFutureImage: true,
        },
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;
