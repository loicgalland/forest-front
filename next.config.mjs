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
    reactStrictMode: false,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                    },
                },
            ],
        });
        return config;
    },
};

export default nextConfig;
