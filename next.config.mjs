/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'picsum.photos'],
    },
    reactStrictMode: false,
    experimental: {
        appDir: true,
    },
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
