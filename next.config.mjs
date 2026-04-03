/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pub-c2dc58c7fe1341f1b491559a89acacca.r2.dev",
      },
    ],
  },
};

export default nextConfig;
