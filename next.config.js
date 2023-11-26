/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.svg$/,
        issuer: { and: [/\.(tsx|ts)?$/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              replaceAttrValues: {
                "#415262": "currentColor",
              },
            },
          },
        ],
      },
    ];
    return config;
  },
};

module.exports = nextConfig;
