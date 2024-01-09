/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "renowned-gift-126140aec8.media.strapiapp.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
